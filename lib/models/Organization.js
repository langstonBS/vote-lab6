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
    maxlength: 200
  },
  imageUrl: {
    type: String,
    maxlength: 100
  },
},
{
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
      delete ret.__v;
    }
  },
  toObject: {
    virtuals: true
  }

});
  
schema.virtual('polls', {
  ref: ['Polls', 'User'],
  localField: '_id',
  foreignField: 'Organization'
});

schema.virtual('memberships', {
  ref: 'memberships',
  localField: '_id',
  foreignField: 'Organization'
});

module.exports = mongoose.model('Organization', schema);
