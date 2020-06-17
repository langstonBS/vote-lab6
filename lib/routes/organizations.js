const { Router } = require('express');
const Organization = require('../models/Organization');
const ensureAuth = require('../middleware/ensureAuth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Organization
      .create(req.body)
      .then(organization => res.send(organization))
      .catch(next);
  })
  .get('/', ensureAuth, (req, res, next) => {
    Organization
      .find()
      .select({
        title: true,
        imageUrl: true
      })
      .then(organization => res.send(organization))
      .catch(next);
  })

  .get('/:id', ensureAuth, (req, res, next) => {
    Organization
      .findById(req.params.id)
      .populate('memberships', {
        organization: true,
        user: true
      })
      .then(organization => res.send(organization))
      .catch(next);
  })


  .patch('/:id', ensureAuth, (req, res, next) => {
    Organization
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(organization => res.send(organization))
      .catch(next);
  })
  
  .delete('/:id', ensureAuth, async(req, res, next) => {
    Organization
      .deleteAndAllPols(req.params.id)
      .then(organization => res.send(organization))
      .catch(next);
  });


