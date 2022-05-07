'use strict';

const express = require('express');
const Card = require('../models/card');
const routeGuard = require('./../middleware/route-guard');
const fileUpload = require('./../middleware/file-upload');
const profileRouter = new express.Router();
const User = require('./../models/user');
const Feedback = require('../models/feedback');

profileRouter.get('/edit', routeGuard, (req, res) => {
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

profileRouter.get('/:id', (req, res, next) => {
  const { id } = req.params;
  let user;
  User.findById(id)
    .then((profile) => {
      user = profile;
      if (!user) {
        throw new Error('PROFILE_NOT_FOUND');
      } else {
        return Card.find({ creator: id })
          .sort({ createdAt: -1 })
          .populate({ path: 'comments', populate: { path: 'user' } });
      }
    })
    .then((cards) => {
      let userProfile = req.user && String(req.user._id) === id;
      let sum = 0;
      cards.map((card) => {
        sum += card.totalScore;
      });
      res.render('profile', {
        profile: user,
        cards,
        userProfile,
        sum,
        pageStyles: [{ style: '/styles/profile.css' }]
      });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = profileRouter;
