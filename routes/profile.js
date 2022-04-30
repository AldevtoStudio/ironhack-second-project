'use strict';

const express = require('express');
const Card = require('../models/card');
const routeGuard = require('./../middleware/route-guard');
const profileRouter = new express.Router();
const User = require('./../models/user');

profileRouter.get('/:id', (req, res, next) => {
  const { id } = req.params;
  let user;
  User.findById(id)
    .then((profile) => {
      user = profile;
      if (!user) {
        throw new Error('PROFILE_NOT_FOUND');
      } else {
        return Card.find({ creator: id }).sort({ createdAt: -1 });
      }
    })
    .then((publications) => {
      let userPub = req.user && String(req.user._id) === id;
      res.render('profile', { profile: user, publications, userPub });
    })
    .catch((error) => {
      console.log(error);
      next(new Error('PROFILE_NOT_FOUND'));
    });
});

profileRouter.get('/edit', routeGuard, (req, res, next) => {
  res.render('profile-edit', { profile: req.user });
});

profileRouter.post(
  '/edit',
  routeGuard,
  fileUpload.single('picture'),
  (req, res, next) => {
    const id = req.user._id;
    const { name, email } = req.body;
    let picture;
    if (req.file) {
      picture = req.file.path;
    }
    User.findByIdAndUpdate(id, { name, email, picture })
      .then(() => {
        res.redirect(`/profile/${id}`);
      })
      .catch((error) => {
        next(error);
      });
  }
);

module.exports = profileRouter;
