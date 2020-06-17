require('dotenv').config();
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');
const Organization = require('../lib/models/Organization');
const Membership = require('../lib/models/Membership');

describe('USERS routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
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


  it('DELETES user vea DELETES', () => {
    return agent
      .delete(`/api/v1/users/${user.id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'langston Thats me',
          phone: '(555) 555-555',
          email: 'to personal',
          communicationMedium: 'phone',
          imageUrl: 'im an dimmiage'
        });
      });
  });



  it('GETS user vea GET and all of the orgnaizatin and memberhsips', async() => {
    const user = await User.create({
      name: 'langston Thats me',
      phone: '(555) 7658-555',
      email: 'to personal',
      communicationMedium: 'phone',
      imageUrl: 'im an dimmiage',
      password:'test12345'
    });

    const org = await Organization.create({
      title: 'Langston Lots',
      description: ' parking lots on blimps so that there is always parking in the sky',
      imageUrl: 'thereisanimage.jpg'
    });


    const org2 = await Organization.create({
      title: 'Lots',
      description: ' parking lots s parking in the sky',
      imageUrl: 'thereisanimage.jpg'
    });

    await Membership.create(
      [{
        organization: org._id,
        user: user._id
      }, { 
        organization: org2._id,
        user: user._id
      }]
    );

    return agent
      .get(`/api/v1/users/${user.id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'langston Thats me',
          phone: '(555) 7658-555',
          email: 'to personal',
          communicationMedium: 'phone',
          memberships: [{ _id: expect.anything(), organization: expect.anything(), user: expect.anything() },
            { _id: expect.anything(), organization: expect.anything(), user: expect.anything() }],
          imageUrl: 'im an dimmiage'
        });
      });
  });


  it('UPDATES user vea PATCH', () => {
    return agent
      .patch(`/api/v1/users/${user.id}`)
      .send({ name: 'Not me' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'langston Thats me',
          phone: '(555) 555-555',
          email: 'to personal',
          communicationMedium: 'phone',
          imageUrl: 'im an dimmiage'
        });
      });
  });
});

