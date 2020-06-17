const { Router } = require('express');
const Vote = require('../models/Vote');
const ensureAuth = require('../middleware/ensureAuth');

module.exports = Router()

  .post('/', ensureAuth, (req, res, next) => {
    Vote
      .findOneAndUpdate({ poll: req.body.poll, user: req.body.user }, req.body, { new: true, upsert: true })
      .then(user => res.send(user))
      .catch(next);
  })
  
  .patch('/:id', ensureAuth, (req, res, next) => {
    Vote
      .findByIdAndUpdate(req.params.id, req.body, { new: true, upsert: true })
      .then(poll => res.send(poll))
      .catch(next);
  })

  .get('/:id', ensureAuth, (req, res, next) => {
    Vote
      .findById(req.query)
      .then(poll => res.send(poll))
      .catch(next);
  });
