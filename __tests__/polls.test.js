const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');


const request = require('supertest');
const app = require('../lib/app');
const Organization = require('../lib/models/Organization');
const Poll = require('../lib/models/Poll');
const User = require('../lib/models/User');



describe('POLLS routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let organization;
  beforeEach(async() => {
    organization = await Organization.create({
      title: 'Langston Lots',
      description: 'parking lots on blimps so that there is always parking in the sky',
      imageUrl: 'thereisanimage.jpg'
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

  it('CREATES a poll via POST', async() => {
    return agent
      .post('/api/v1/polls')
      .send({
        organization: organization._id,
        title: 'the poll',
        description: 'its a pole',
        options: [1, 2]
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          organization: organization.id,
          title: 'the poll',
          description: 'its a pole',
          options: ['1', '2'],
          __v: 0
        });
      });
  });

  it('GETS a poll via GET', async() => {
    const poll =  Poll.create(
      {
        organization: organization._id,
        title: 'the poll',
        description: 'its a pole',
        options: [1, 2]
      });
    
    return agent
      .get('/api/v1/polls')
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(),
          organization: {
            _id: expect.anything(),
            title: 'Langston Lots'
          },
          title: 'the poll',
          description: 'its a pole',
          options: ['1', '2'],
          __v: 0
        }]);
      });
  });

  it('GETS a single poll via GET ID', async() => {
    const poll = await Poll.create(
      {
        organization: organization._id,
        title: 'the poll',
        description: 'its a pole',
        options: [1, 2]
      });

    return agent
      .get(`/api/v1/polls/${poll.id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          organization: {
            _id: expect.anything(),
            title: 'Langston Lots',
            description: 'parking lots on blimps so that there is always parking in the sky'
          },
          title: 'the poll',
          description: 'its a pole',
          options: ['1', '2'],
          __v: 0
        });
      });
  });

  it('UPDATES polls vea PATCH', async() => {
    const poll = await Poll.create(
      {
        organization: organization._id,
        title: 'the poll',
        description: 'its a pole',
        options: [1, 2]
      });

    return agent
      .patch(`/api/v1/polls/${poll.id}`)
      .send({ title: 'NEW POLL', description: 'IM ME' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          organization: organization.id,
          title: 'NEW POLL',
          description: 'IM ME',
          options: ['1', '2'],
          __v: 0
        });
      });
  });

  it('DELETES polls vea DELETE', async() => {
    const poll = await Poll.create(
      {
        organization: organization._id,
        title: 'the poll',
        description: 'its a pole',
        options: [1, 2]
      });

    return agent.delete(`/api/v1/polls/${poll.id}`)
      .then(res => {
        expect(res.body).toEqual(
          {
            _id: expect.anything(),
            organization: organization.id,
            title: 'the poll',
            description: 'its a pole',
            options: ['1', '2'],
            __v: 0
          });
      });
  });
});


