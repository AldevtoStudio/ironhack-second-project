'use strict';

const express = require('express');
const Card = require('../models/card');
const routeGuard = require('./../middleware/route-guard');
const leaderboardRouter = new express.Router();
const User = require('./../models/user');

leaderboardRouter.get('/', (req, res, next) => {
  let firstUser = {};
  let secondUser = {};
  let thirdUser = {};
  let currentUSer = {};

  User.find()
    .sort({ totalScore: -1 })
    .then((users) => {
      users.forEach((value, index) => {
        console.table('user' + value);
        console.log(index);
        if (index === 0) {
          firstUser.name = value.name;
          firstUser.score = value.totalScore;
        }
        if (index === 1) {
          secondUser.name = value.name;
          secondUser.score = value.totalScore;
        }
        if (index === 2) {
          thirdUser.name = value.name;
          thirdUser.score = value.totalScore;
        }
      });
      console.log(firstUser);
      console.log(secondUser);
      console.log(thirdUser);
      res.render('leaderboard', {
        users,
        pageStyles: [{ style: '/styles/leaderboard.css' }]
      });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = leaderboardRouter;
