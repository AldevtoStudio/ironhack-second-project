'use strict';

const express = require('express');
const Card = require('../models/card');
const routeGuard = require('./../middleware/route-guard');
const leaderboardRouter = new express.Router();
const User = require('./../models/user');

leaderboardRouter.get('/', (req, res, next) => {
  let user1 = {};
  let user2 = {};
  let user3 = {};
  let currentUSer = {};

  User.find()
    .sort({ totalScore: -1 })
    .then((users) => {
      users.forEach((value, index) => {
        console.table('user' + value);
        console.log(index);
        if (index === 0) {
          user1.name = value.name;
          user1.score = value.totalScore;
          user1.picture = value.picture;
        }
        if (index === 1) {
          user2.name = value.name;
          user2.score = value.totalScore;
          user2.picture = value.picture;
        }
        if (index === 2) {
          user3.name = value.name;
          user3.score = value.totalScore;
          user3.picture = value.picture;
        }
      });
      console.log(user1);
      console.log(user2);
      console.log(user3);
      res.render('leaderboard', {
        users,
        user1,
        user2,
        user3,
        pageStyles: [{ style: '/styles/leaderboard.css' }]
      });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = leaderboardRouter;
