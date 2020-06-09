const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 70
  },
  phone: {
    type: String,
    required: true,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    maxlength: 60
  },
  communicationMedium: {
    type: String,
    enum: ['phone', 'email']
  },
  imageUrl: {
    type: String,
    maxlength: 100
  }

});

module.exports = mongoose.model('Organization', schema);


