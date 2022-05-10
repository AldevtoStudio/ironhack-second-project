'use strict';

const express = require('express');
const router = express.Router();
const routeGuard = require('./../middleware/route-guard');
const Notification = require('./../models/notification');
const Card = require('./../models/card');

router.get('/', routeGuard, (req, res, next) => {
  let randomCard;

  Card.count({ seenBy: { $ne: req.user._id } })
    .then((count) => {
      var random = Math.floor(Math.random() * count);
      return Card.findOne({ seenBy: { $ne: req.user._id } })
        .skip(random)
        .populate('creator')
        .populate('comments');
    })
    .then((card) => {
      randomCard = card;

      res.render('home', {
        card: randomCard,
        pageStyles: [{ style: '/styles/home.css' }]
      });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
