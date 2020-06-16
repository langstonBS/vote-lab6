const { Router } = require('express');
const Membership = require('../models/Membership');


module.exports = Router()

  .post('/', (req, res, next) => {
    Membership
      .create(req.body)
      .then(Membership => res.send(Membership))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Membership
      .find(req.query)
      .populate('user', { name: true, imageURL: true })
      .populate('organizations', { title: true, imageUrl: true }) 
      .then(poll => res.send(poll))
      .catch(next);
  })

  .delete('/:id', async(req, res, next) => {
    Membership
      .deleteAndAllVotes(req.params.id)
      .then(poll => res.send(poll))
      .catch(next);
  });
