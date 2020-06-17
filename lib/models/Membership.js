const mongoose = require('mongoose');
const votes = require('../routes/votes');

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

schema.statics.deleteAndAllVotes = async function(id) {
  const Vote = this.model('Vote');

  const votes = await Vote.find({ memberships: id });

  const deleteVote = votes.map(vote => Vote.deleteVotes(vote.id));
  return Promise.all([
    this.findByIdAndDelete(id),
    ...deleteVote
  ])
    .then(([memberships]) => memberships);
};

schema.virtual('votes', {
  ref: 'Vote',
  localField: '_id',
  foreignField: 'membership'
});

module.exports = mongoose.model('Membership', schema);
