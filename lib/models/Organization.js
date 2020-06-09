const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 20
  },
  description: {
    type: String,
    required: true,
    maxlength: 20
  },
  imageUrl: {
    type: String,
    maxlength: 100
  }

});

module.exports = mongoose.model('Organization', schema);
