const { Router } = require('express');
const Membership = require('../models/Membership');

module.exports = Router()

  .post('/', (req, res, next) => {
    Membership
      .create(req.body)
      .then(Membership => res.send(Membership))
      .catch(next);
  })
  .get('/memberships?org', (req, res, next) => {
    Membership
      .find(req.param('org'))
      .then(poll => res.send(poll))
      .catch(next);
  });
