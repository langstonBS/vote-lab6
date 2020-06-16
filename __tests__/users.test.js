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

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('CREATES user vea POST', () => {
    return request(app)
      .post('/api/v1/users')
      .send({
        name: 'langston Thats me',
        phone: '(555) 555-555',
        email: 'to personal',
        communicationMedium: 'phone',
        imageUrl: 'im an dimmiage',
        password:'test12345'
      })
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


  it('fails to CREATE user vea POST', () => {
    return request(app)
      .post('/api/v1/user')
      .send({
        name: 'langston Thats me',
        phone: '(555) 555-555',
        email: 'to personal',
        communicationMedium: 'phone',
        imageUrl: 'im an dimmiage',
        password:'test12345'
      })
      .then(res => {
        expect(res.body).toEqual({
          'message': 'Not Found',
          'status': 404,
        });
      });
  });


  it('deletes user vea Deleets', () => {
    return User.create({
      name: 'langston Thats me',
      phone: '(555) 555-555',
      email: 'to personal',
      communicationMedium: 'phone',
      imageUrl: 'im an dimmiage',
      password:'test12345'
    })
      .then(user => request(app).delete(`/api/v1/users/${user.id}`))
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

    return request(app)
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
    return User.create({
      name: 'langston Thats me',
      phone: '(555) 555-555',
      email: 'to personal',
      communicationMedium: 'phone',
      imageUrl: 'im an dimmiage',
      password:'test12345'
    })
      .then(user => request(app).patch(`/api/v1/users/${user.id}`)
        .send({ name: 'Not me' }))
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

