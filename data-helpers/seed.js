require('dotenv').config();
const chance = require('chance').Chance();
const Membership = require('../lib/models/Membership');
const Poll = require('../lib/models/poll');
const Organization = require('../lib/models/Organization');
const User = require('../lib/models/User');
const Vote = require('../lib/models/Vote');


module.exports = async ({
  organization = 5,
  user = 100,
  //membership = 100,
 // vote = 300,
  poll = 5 }) => {
  
  const org  = await Organization.create([...Array(organization)].map(() => ({
    title: chance.company(),
    description: chance.sentence(),
    imageUrl: chance.url()

  })));
  
  const users = await User.create([...Array(users)].map(() => ({
    name: chance.name(),
    phone: chance.phone(),
    email: chance.email(),
    communicationMedium: 'email',
    imageUrl: chance.url()

  })));
  const polls = await Poll.create([...Array(polls)].map(() => ({
    organization: chance.pickone(organization)._id,
    title: chance.hammertime(),
    description: chance.sentence(),
    options: ['Y', 'N']

  })));

  await Membership.create([...Array(memberships)].map(() => ({
    organization: chance.pickone(organization)._id,
    user: chance.pickone(user)._id,
  })));
  await Vote.create([...Array(votes)].map(() => ({
    options: [],
    user: chance.pickone(user)._id,
    poll: chance.pickone(poll)._id,
  })));
};

