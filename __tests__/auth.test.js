require('dotenv').config();
require('../data-helpers/data-helpers')
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');


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
      .post('/api/v1/auth/signup')
      .send({
        name: 'langston Thats me',
        phone: '(555) 555-555',
        email: 'to personal',
        communicationMedium: 'phone',
        imageUrl: 'im an dimmiage',
        password: '1234'

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

  it('LOG in user via POST', async() => {
    const user = await User.create({
      name: 'langston Thats me',
      phone: '(555) 555-555',
      email: 'to personal',
      communicationMedium: 'phone',
      imageUrl: 'im an dimmiage',
      password: '1234'
    });
    return request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'to personal',
        password: '1234'
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

  it('CREATES user vea POST', async() => {
    const user = await User.create({
      name: 'langston Thats me',
      phone: '(555) 555-555',
      email: 'to personal',
      communicationMedium: 'phone',
      imageUrl: 'im an dimmiage',
      password: '1234'
    });

    const agent = request.agent(app);

    return agent
      .post('/api/v1/auth/login')
      .send({
        email: 'to personal',
        password: '1234'
      })
      .then(() => {
        return agent
          .get('/api/v1/auth/verify');
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: user.id,
          name: 'langston Thats me',
          phone: '(555) 555-555',
          email: 'to personal',
          communicationMedium: 'phone',
          imageUrl: 'im an dimmiage'
        });
      });
  });


});

