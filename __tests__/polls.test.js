const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const Organization = require('../lib/models/Organization');
const Poll = require('../lib/models/Poll');



describe('votes routes', () => {
  beforeAll(async () => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let organization;
  beforeEach(async () => {
    organization = await Organization.create({
      title: 'Langston Lots',
      description: 'parking lots on blimps so that there is always parking in the sky',
      imageUrl: 'thereisanimage.jpg'
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('CREATES a poll via POST', async () => {
    return request(app)
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
          options: ["1", "2"],
          __v: 0
        });
      });
  });

  it('GETS a poll via GET', async () => {
    return Poll.create(
      {
        organization: organization._id,
        title: 'the poll',
        description: 'its a pole',
        options: [1, 2]
      }
    )
      .then(() => request(app).get(`/api/v1/polls`))
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(),
          organization: {
            _id: expect.anything(),
            title: "Langston Lots"
          },
          title: 'the poll',
          description: 'its a pole',
          options: ["1", "2"],
          __v: 0
        }]);
      });
  });

  it('GETS a single poll via GET ID', async () => {
    return Poll.create(
      {
        organization: organization._id,
        title: 'the poll',
        description: 'its a pole',
        options: [1, 2]
      }
    )
      .then(poll => request(app).get(`/api/v1/polls/${poll.id}`))
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
          options: ["1", "2"],
          __v: 0
        });
      });
  });

  it('UPDATES polls vea PATCH', () => {
    return Poll.create(
      {
        organization: organization._id,
        title: 'the poll',
        description: 'its a pole',
        options: [1, 2]
      }
    )
      .then(poll => request(app)
        .patch(`/api/v1/polls/${poll.id}`)
        .send({ title: 'NEW POLL', description: 'IM ME' }))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          organization: organization.id,
          title: 'NEW POLL',
          description: 'IM ME',
          options: ["1", "2"],
          __v: 0
        });
      });
  });

  it('DELETES polls vea DELETE', () => {
    return Poll.create(
      {
        organization: organization._id,
        title: 'the poll',
        description: 'its a pole',
        options: [1, 2]
      })
      .then(poll => request(app).delete(`/api/v1/polls/${poll.id}`))
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


