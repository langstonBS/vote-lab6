require('dotenv').config();
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  },
  passwordHash: {
    type: String,
    required: true
  }

}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
      delete ret.__v;
      delete ret.passwordHash;
    }
  },
  toObject: {
    virtuals: true
  }

});

schema.virtual('memberships', {
  ref: 'Membership',
  localField: '_id',
  foreignField: 'user'
});

schema.virtual('password').set(function(password) {
  this.passwordHash = bcryptjs.hashSync(password, +process.env.SALT_ROUNDS || 8);
});

schema.statics.authorizeToken = function(email, password) {
  return this.findOne({ email })
    .then(user => {
      if(!user) {
        throw new Error('Wrong Users/password');
      }
      if(!bcryptjs.compareSync(password, user.passwordHash)) {
        throw new Error('Wrong Users/password');
      }
      return user;
    });
};

schema.statics.varify = function(token) {
  const { sub } = jwt.verify(token, process.env.APP_SECRET);
  return this.hydrate(sub);
};
schema.methods.authToken = function() {
  return jwt.sign({ sub: this.toJSON() }
    , process.env.APP_SECRET, { expiresIn: '10h' });
};

module.exports = mongoose.model('User', schema);


