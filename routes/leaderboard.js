'use strict';

const express = require('express');
const Card = require('../models/card');
const routeGuard = require('./../middleware/route-guard');
const leaderboardRouter = new express.Router();
const User = require('./../models/user');

leaderboardRouter.get('/', (req, res, next) => {
  User.find()
    .sort({ totalScore: -1 })
    .then((users) => {
      console.log(users);
      res.render('leaderboard', { users });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = leaderboardRouter;
