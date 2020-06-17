const { Router } = require('express');
const Membership = require('../models/Membership');
const ensureAuth = require('../middleware/ensureAuth');


module.exports = Router()

  .post('/', ensureAuth, (req, res, next) => {
    Membership
      .create(req.body)
      .then(Membership => res.send(Membership))
      .catch(next);
  })

  .get('/', ensureAuth, (req, res, next) => {
    Membership
      .find(req.query)
      .populate('user', { name: true, imageURL: true })
      .populate('organizations', { title: true, imageUrl: true }) 
      .then(poll => res.send(poll))
      .catch(next);
  })

  .delete('/:id', ensureAuth, async(req, res, next) => {
    Membership
      .deleteAndAllVotes(req.params.id)
      .then(poll => res.send(poll))
      .catch(next);
  });
