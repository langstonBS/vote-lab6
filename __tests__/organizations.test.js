const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const Organization = require('../lib/models/Organization');

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

  it('CREATES organization vea POST', () => {
    return request(app)
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
          imageUrl: 'thereisanimage.jpg',
          __v: 0
        });
      });
  });
  


  it('GETS organization vea GET', () => {
    return Organization.create([{
      title: 'Langston Lots',
      description: ' parking lots on blimps so that there is always parking in the sky',
      imageUrl: 'thereisanimage.jpg'
    }])
      .then(organization => request(app).get(`/api/v1/organizations`))
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(),
          title: 'Langston Lots',
          imageUrl: 'thereisanimage.jpg',
        }]);
      });
  });



  it('GETS organization vea GET by id', () => {
    return Organization.create({
      title: 'Langston Lots',
      description: ' parking lots on blimps so that there is always parking in the sky',
      imageUrl: 'thereisanimage.jpg'
    })
      .then(organization => request(app).get(`/api/v1/organizations/${organization.id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          title: 'Langston Lots',
          description: ' parking lots on blimps so that there is always parking in the sky',
          imageUrl: 'thereisanimage.jpg',
          __v: 0
        });
      });
  });

  it('UPDATES organization vea PATCH', () => {
    return Organization.create({
      title: 'Langston Lots',
      description: ' parking lots on blimps so that there is always parking in the sky',
      imageUrl: 'thereisanimage.jpg'
    })
      .then(organization => {
        return request(app)
          .patch(`/api/v1/organizations/${organization.id}`)
          .send({ description: 'me' });
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          title: 'Langston Lots',
          description: 'me',
          imageUrl: 'thereisanimage.jpg',
          __v: 0
        });
      });
  });


  it('DELETES organization vea DELETE by id', () => {
    return Organization.create({
      title: 'Langston Lots',
      description: ' parking lots on blimps so that there is always parking in the sky',
      imageUrl: 'thereisanimage.jpg'
    })
      .then(organization => request(app).delete(`/api/v1/organizations/${organization.id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          title: 'Langston Lots',
          description: ' parking lots on blimps so that there is always parking in the sky',
          imageUrl: 'thereisanimage.jpg',
          __v: 0
        });
      });
  });



});
