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
  options: [String],
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
    
schema.virtual('votes', {
  ref: 'votes',
  localField: 'options',
  foreignField: 'Poll',
  count : true
});


schema.statics.deleteAndAllVotes = function(id) {
  return Promise.all([
    this.findByIdAndDelete(id),
    this.model('Vote').deleteMany({ poll: id })
  ])
    .then(([poll]) => poll);
};

schema.methods.getCountAsync = async function getCountAsync() {
  const populateVote = await this.populate('options').execPopulate();
  return populateVote.options;
};

module.exports = mongoose.model('Poll', schema);
