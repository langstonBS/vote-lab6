require('dotenv').config();
require('./lib/utils/connect')();

const mongoose = require('mongoose');
const seed = require('./db/seed');

seed()
  .then(() => console.log('All Done!'))
  .catch(err => console.error(`Error: ${err}`))
  .finally(() => mongoose.connection.close());
