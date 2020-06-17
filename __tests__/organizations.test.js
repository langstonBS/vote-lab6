const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const Organization = require('../lib/models/Organization');
const User = require('../lib/models/User');
const Membership = require('../lib/models/Membership');

describe('ORGANIZATION routes', () => {
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

  it('CREATES organization vea POST', () => {
    return agent
      .post('/api/v1/organizations')
      .send({
        title: 'Langston Lots',
        description: ' parking lots on blimps so that there is always parking in the sky',
        imageUrl: 'thereisanimage.jpg'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          title: 'Langston Lots',
          description: ' parking lots on blimps so that there is always parking in the sky',
          imageUrl: 'thereisanimage.jpg'
        });
      });
  });
  
  it('GETS organization vea GET', () => {
    const organization = Organization.create([{
      title: 'Langston Lots',
      description: ' parking lots on blimps so that there is always parking in the sky',
      imageUrl: 'thereisanimage.jpg'
    }]);
      
    return agent
      .get('/api/v1/organizations')
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(),
          title: 'Langston Lots',
          imageUrl: 'thereisanimage.jpg',
        }]);
      });
  });


  it('GETS organization vea GET by id', async() => {


    const organization = await Organization.create({
      title: 'Langston Lots',
      description: ' parking lots on blimps so that there is always parking in the sky',
      imageUrl: 'thereisanimage.jpg'
    });

    await Membership.create(
      [{
        organization: organization._id,
        user: user._id
      }]
    );

    return agent
      .get(`/api/v1/organizations/${organization.id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          title: 'Langston Lots',
          description: ' parking lots on blimps so that there is always parking in the sky',
          imageUrl: 'thereisanimage.jpg',
          memberships: [{ _id: expect.anything(), organization: expect.anything(), user: expect.anything() }]
        });
      });
  });

  it('UPDATES organization vea PATCH', async() => {
    const organization =  await Organization.create({
      title: 'Langston Lots',
      description: ' parking lots on blimps so that there is always parking in the sky',
      imageUrl: 'thereisanimage.jpg'
    });
      
    return agent
      .patch(`/api/v1/organizations/${organization.id}`)
      .send({ description: 'me' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          title: 'Langston Lots',
          description: 'me',
          imageUrl: 'thereisanimage.jpg'
        });
      });
  });

  it('DELETES organization vea DELETE by id', async() => {
    const organization =  await Organization.create({
      title: 'Langston Lots',
      description: ' parking lots on blimps so that there is always parking in the sky',
      imageUrl: 'thereisanimage.jpg'
    });

    
    return agent
      .delete(`/api/v1/organizations/${organization.id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          title: 'Langston Lots',
          description: ' parking lots on blimps so that there is always parking in the sky',
          imageUrl: 'thereisanimage.jpg'
        });
      });
  });
});


