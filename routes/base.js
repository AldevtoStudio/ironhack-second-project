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
      return Card.findOne({ seen: false })
        .skip(random)
        .populate('creator')
        .populate('comments');
    })
    .then((card) => {
      randomCard = card;

      return Notification.find({ read: false })
        .populate('card')
        .populate('user');
    })
    .then((notifications) => {
      // let userNotifications = [];
      // notifications.forEach((notification) => {
      //   let isOwner = String(notification.card.creator) == String(req.user._id);
      //   let isSameUser = String(notification.user._id) != String(req.user._id);

      //   if (isSameUser && isOwner) userNotifications.push(notification);
      // });

      res.render('home', {
        card: randomCard
        // notifications: userNotifications,
        // notificationCount: userNotifications.length
      });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
