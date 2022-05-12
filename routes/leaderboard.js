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
  let sum;
  User.find()
    .sort({ totalScore: -1 })
    .then((users) => {
      users.forEach((value, index) => {
        if (index === 0) {
          user1.name = value.name;
          sum = 0;
          value.totalScore.forEach((score)=> {
            sum += score;
          })
          user1.score = sum;
          user1.picture = value.picture;
        }
        if (index === 1) {
          user2.name = value.name;
          sum = 0;
          value.totalScore.forEach((score)=> {
            sum += score;
          })
          user2.score = sum;
          user2.picture = value.picture;
        }
        if (index === 2) {
          user3.name = value.name;
          sum = 0;
          value.totalScore.forEach((score)=> {
            sum += score;
          })
          user3.score = value.totalScore;
          user3.picture = value.picture;
        }
      });
      return Card.find().sort({ totalScore: -1 }).populate('creator').limit(10);
    })
    .then((cards) => {
      let cardFirst;
      let restCards = [];
      cards.forEach((card, index)=> {
        console.log("Index" + index);
        if (index === 0){
          cardFirst = card;
        }
        if (index > 0){
          console.log("push" + card);
          restCards.push(card);
        }
      })
      console.log(restCards);
      res.render('leaderboard', {
        user1,
        user2,
        user3,
        cardFirst,
        restCards,
        pageStyles: [
          { style: '/styles/leaderboard.css' },
          { style: '/styles/card.css' }
        ]
      });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = leaderboardRouter;
