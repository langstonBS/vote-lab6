const { Router } = require('express');
const Vote = require('../models/Vote');
const { put } = require('./users');

module.exports = Router()

  .post('/', (req, res, next) => {
    Vote
      .create(req.body)
      .then(user => res.send(user))
      .catch(next);
  })
  .patch('/:id', (req, res, next) => {
    Vote
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(poll => res.send(poll))
      .catch(next);
  });
