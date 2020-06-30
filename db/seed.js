require('dotenv').config();
const chance = require('chance').Chance();
const Membership = require('../lib/models/Membership');
const Poll = require('../lib/models/poll');
const Organization = require('../lib/models/Organization');
const User = require('../lib/models/User');
const Vote = require('../lib/models/Vote');


module.exports = async({  orgs = 5, users = 100, memberships = 100, votes = 300, polls = 5 } = {}) => {
  
  const orgOne  = await Organization.create([...Array(orgs)].map(() => ({
    title: chance.company(),
    description: chance.sentence(),
    imageUrl: chance.url()

  })));
  
  const userOne = await User.create([...Array(users)].map(() => ({
    name: chance.name(),
    phone: chance.phone(),
    email: chance.email(),
    communicationMedium: 'email',
    imageUrl: chance.url(),
    password: chance.word()

  })));
  const pollOne = await Poll.create([...Array(polls)].map(() => ({
    organization: chance.pickone(orgOne)._id,
    title: chance.hammertime(),
    description: chance.sentence(),
    options: ['Y', 'N']

  })));

  await Membership.create([...Array(memberships)].map(() => ({
    organization: chance.pickone(orgOne)._id,
    user: chance.pickone(userOne)._id,
  })));


  await Vote.create([...Array(votes)].map(() => ({
    options: [],
    user: chance.pickone(userOne)._id,
    poll: chance.pickone(pollOne)._id,
  })));
};

