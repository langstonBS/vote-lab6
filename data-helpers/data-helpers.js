require('dotenv').config();

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const seed = require('./seed');

beforeAll(async() => {
  const uri = await mongod.getUri();
  return connect(uri);
});

beforeEach(() => {
  return mongoose.connection.dropDatabase();
});

beforeEach(() => {
  return seed({ organization: 5,
    user: 100,
    membership: 100,
    vote: 300,
    poll: 5 });
});

afterAll(async() => {
  await mongoose.connection.close();
  return mongod.stop();
});
