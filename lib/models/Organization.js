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
  
schema.virtual('memberships', {
  ref: 'Membership',
  localField: '_id',
  foreignField: 'organization'
});

schema.virtual('polls', {
  ref: 'Polls',
  localField: '_id',
  foreignField: 'organization'
});



schema.statics.deleteAndAllPols = async function(id) {
  const Poll = this.model('Poll');
  const poll = await Poll.find({ organization: id });
  const deletePollPromises = poll.map(poll => Poll.deleteAndAllVotes(poll.id));

  return Promise.all([
    this.findByIdAndDelete(id),
    ...deletePollPromises
  ]).then(([organization]) => organization);

};

module.exports = mongoose.model('Organization', schema);
