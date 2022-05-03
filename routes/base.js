'use strict';

const express = require('express');
const router = express.Router();
const routeGuard = require('./../middleware/route-guard');
const Card = require('./../models/card');

router.get('/', (req, res, next) => {
  Card.count({ seen: false })
    .then((count) => {
      var random = Math.floor(Math.random() * count);
      return Card.findOne({ seen: false })
        .skip(random)
        .populate('creator')
        .populate('comments');
    })
    .then((card) => {
      res.render('home', { card });
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/leaderboard', (req, res, next) => {
  const id = req.user;
});

module.exports = router;
