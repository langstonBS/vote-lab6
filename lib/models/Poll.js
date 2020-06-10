const mongoose = require('mongoose');

const schema = new mongoose.Schema({

  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 60
  },
  description: {
    type: String,
    required: true,
    maxlength: 200
  },
  list: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4]
  }

});


module.exports = mongoose.model('Poll', schema);
