const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
},
{
  toJSON: {
    virtual: true,
    transform: (doc, ret) => {
      delete ret.id;
    }
  },

  toObject: {
    virtual: true
  }
});

schema.statics.deleteAndAllVotes = function(id) {
  return Promise.all([
    this.findByIdAndDelete(id),
    this.model('Vote').deleteMany({ votes: id })
  ])
    .then(([memberships]) => memberships);
};

schema.virtual('votes', {
  ref: 'Vote',
  localField: '_id',
  foreignField: 'membership'
});

module.exports = mongoose.model('Membership', schema);
