'use strict';

const Notification = require('./../models/notification');

module.exports = (req, res, next) => {
  Notification.find({ read: false })
    .populate('card')
    .populate('user')
    .then((notifications) => {
      let userNotifications = [];

      notifications.forEach((notification) => {
        if (!notification.card || !req.user) return;

        let isOwner = String(notification.card.creator) == String(req.user._id);
        let isSameUser = String(notification.user._id) != String(req.user._id);

        if (isSameUser && isOwner) userNotifications.push(notification);
      });

      res.locals.notifications = userNotifications;
      next();
    })
    .catch((error) => {
      next(error);
    });
};
