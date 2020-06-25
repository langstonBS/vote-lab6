const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');


const request = require('supertest');
const app = require('../lib/app');
const Poll = require('../lib/models/Poll');
const User = require('../lib/models/User');
const Vote = require('../lib/models/Vote');
const Organization = require('../lib/models/Organization');

describe('VOTES routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let poll;
  beforeEach(async() => {
    let organization = await Organization.create({
      title: 'Langston Lots',
      description: 'parking lots on blimps so that there is always parking in the sky',
      imageUrl: 'thereisanimage.jpg'
    });

    poll = await Poll.create({
      organization: organization._id,
      title: 'the poll',
      description: 'its a pole',
      options: ['red', 'blue', 'green']
    });
  });

  const agent = request.agent(app);

  let user;
  beforeEach(async() => {
    user = await User.create({
      name: 'langston Thats me',
      phone: '(555) 555-555',
      email: 'to personal',
      communicationMedium: 'phone',
      imageUrl: 'im an dimmiage',
      password: '1234'
    });
    return agent
      .post('/api/v1/auth/login')
      .send({
        email: 'to personal',
        password: '1234'
      });
  });
  
  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('FAIL TO CREATE a vote with POST', () => {
    return agent
      .post('/api/v1/vote')
      .send({
        user: user._id,
        poll: poll.id,

      })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Not Found',
          status: 404,
  
        });
      });
  });

  
  it('CREATE a vote with POST', async() => {
    return agent
      .post('/api/v1/votes')
      .send({
        user: user._id,
        poll: poll._id,

      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          options: [],
          user: user.id,
          poll: poll.id,
          __v: 0
        });
      });
  });



  it('UPDATES votes vea PATCH', async () => {
    const vote = await Vote.create({
      user: user._id,
      poll: poll._id,
    });
    return agent
      .patch(`/api/v1/votes/${vote.id}`)
      .send({ options: ['blue'] })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          options: ['blue'],
          user: user.id,
          poll: poll.id,
          __v: 0
        });
      });
  });

  it('GETS a vote with GET', () => {
    return agent
      .post('/api/v1/votes')
      .send({
        user: user._id,
        poll: poll._id,
      })

      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          options: [],
          user: user.id,
          poll: poll.id,
          __v: 0
        });
      });
  });

});
