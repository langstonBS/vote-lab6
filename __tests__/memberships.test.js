const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const Organization = require('../lib/models/Organization');
const User = require('../lib/models/User');
const Membership = require('../lib/models/Membership');

describe('votes routes', () => {
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

  let user;
  beforeEach(async() => {
    user = await User.create({
      name: 'langston Thats me',
      phone: '(555) 555-555',
      email: 'to personal',
      communicationMedium: 'phone',
      imageUrl: 'im an dimmiage'
    });
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('FAIL TO CREATE a membership with POST', () => {
    return request(app)
      .post('/api/v1/membership')
      .send({
        organization: organization._id,
        user: user._id
      })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Not Found',
          status: 404,
  
        });
      });
  });

  it('CREATE a membership with POST', () => {
    return request(app)
      .post('/api/v1/memberships')
      .send({
        organization: organization._id,
        user: user._id
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          organization: organization.id,
          user: user.id,
          __v: 0
        });
      });
  });



  it('GIT a membership with an Organization with GET', async() => {
    await Membership.create({
      organization: organization._id,
      user: user._id
    });
    return request(app).get(`/api/v1/memberships?user=${user._id}`)
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(),
          organization: expect.anything(),
          user:{
            _id: expect.anything(),
            name: 'langston Thats me'
          },
          __v: 0
        }]);
      });
  });

  it('DELETES membership vea DELETE', () => {
    return Membership.create(
      {
        organization: organization._id,
        user: user._id
      })
      .then(membership => request(app).delete(`/api/v1/memberships/${membership.id}`))
      .then(res => {
        expect(res.body).toEqual(
          {
            _id: expect.anything(),
            organization: organization.id,
            user: user.id,
            __v: 0
          });
      });
  });
});


