const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');

describe('votes routes', () => {
  beforeAll(async () => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('creates user vea post', () => {
    return request(app)
      .post('/api/v1/users')
      .send({
        name: 'langston Thats me',
        phone: '(555) 555-555',
        email: 'to personal',
        communicationMedium: 'phone',
        imageUrl: 'im an dimmiage'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'langston Thats me',
          phone: '(555) 555-555',
          email: 'to personal',
          communicationMedium: 'phone',
          imageUrl: 'im an dimmiage',
          __v: 0
        });
      });
  });
  it('fails to create user vea post', () => {
    return request(app)
      .post('/api/v1/user')
      .send({
        name: 'langston Thats me',
        phone: '(555) 555-555',
        email: 'to personal',
        communicationMedium: 'phone',
        imageUrl: 'im an dimmiage'
      })
      .then(res => {
        expect(res.body).toEqual({
          "message": "Not Found",
          "status": 404,
        });
      });
  });


  it('deletes user vea Deleets', () => {
    return User.create({
      name: 'langston Thats me',
      phone: '(555) 555-555',
      email: 'to personal',
      communicationMedium: 'phone',
      imageUrl: 'im an dimmiage'
    })
      .then(user => request(app).delete(`/api/v1/users/${user.id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'langston Thats me',
          phone: '(555) 555-555',
          email: 'to personal',
          communicationMedium: 'phone',
          imageUrl: 'im an dimmiage',
          __v: 0
        });
      });
  });

  it('gits user vea GET', () => {
    return User.create({
      name: 'langston Thats me',
      phone: '(555) 555-555',
      email: 'to personal',
      communicationMedium: 'phone',
      imageUrl: 'im an dimmiage'
    })
      .then(user => request(app).get(`/api/v1/users/${user.id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'langston Thats me',
          phone: '(555) 555-555',
          email: 'to personal',
          communicationMedium: 'phone',
          imageUrl: 'im an dimmiage',
          __v: 0
        });
      });
  });

  it('gits user vea GET', () => {
    return User.create({
      name: 'langston Thats me',
      phone: '(555) 555-555',
      email: 'to personal',
      communicationMedium: 'phone',
      imageUrl: 'im an dimmiage'
    })
      .then(user => request(app).patch(`/api/v1/users/${user.id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'langston Thats me',
          phone: '(555) 555-555',
          email: 'to personal',
          communicationMedium: 'phone',
          imageUrl: 'im an dimmiage',
          __v: 0
        });
      });
  });


});
