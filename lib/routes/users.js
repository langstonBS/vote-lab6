const { Router } = require('express');
const User = require('../models/User');

module.exports = Router()

  .get('/:id', (req, res, next) => {
    User
      .findById(req.params.id)
      .populate('memberships', {
        organization: true,
        user: true
      })
      .then(user => res.send(user))
      .catch(next);
  })
  
  .patch('/:id', (req, res, next) => {
    User
      .findById(req.params.id)
      .then(user => res.send(user))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    User
      .findByIdAndDelete(req.params.id)
      .then(user => res.send(user))
      .catch(next);
  });


