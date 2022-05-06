'use strict';

const express = require('express');
const Card = require('./../models/card');
const Feedback = require('../models/feedback');
const Comment = require('./../models/comment');
const Notification = require('./../models/notification');
const routeGuard = require('./../middleware/route-guard');
const fileUpload = require('./../middleware/file-upload');
const cardRouter = new express.Router();

let cardTitle;
let cardText;
let cardMedia;

cardRouter.get('/create', routeGuard, (req, res) => {
  res.render('card/create', {
    cardTitle,
    cardText,
    cardMedia,
    error: { message: err.error }
  });
});

cardRouter.post(
  '/create',
  routeGuard,
  fileUpload.single('media'),
  (req, res, next) => {
    const { title, text } = req.body;
    cardTitle = title;
    cardText = text;
    if (req.file) {
      cardMedia = req.file.path;
    }

    Card.create({
      title: cardTitle,
      media: cardMedia,
      text: cardText,
      creator: req.user._id
    })
      .then(() => {
        cardMedia = '';
        cardText = '';
        cardTitle = '';
        res.redirect('/');
      })
      .catch((err) => {
        if (err.message.includes('Card validation failed')) {
          err.error = 'Please, fill at least one field.';

          res.status(404).render('card/create', {
            cardTitle,
            cardText,
            cardMedia,
            error: { message: err.error }
          });
          return;
        }
        next(err);
      });
  }
);

cardRouter.post('/:id/delete', routeGuard, (req, res, next) => {
  const { id } = req.params;
  Card.findOneAndDelete({ _id: id, creator: req.user._id })
    .then(() => {
      res.redirect(`/profile/${req.user._id}`);
    })
    .catch((error) => {
      next(error);
    });
});

cardRouter.post('/:id/like', routeGuard, (req, res, next) => {
  const { id } = req.params;
  Feedback.findOne({ card: id, user: req.user._id })
    .then((like) => {
      if (like) {
        throw new Error('USER_CANNOT_LIKE_THE_SAME_CARD');
      } else {
        return Feedback.create({ card: id, user: req.user._id, value: 0.3 });
      }
    })
    .then(() => {
      return Notification.create({
        card: id,
        user: req.user._id,
        comment: false
      });
    })
    .then(() => {
      return Feedback.find({ card: id });
    })
    .then((feedbacks) => {
      let cardValue = 0;

      feedbacks.map((feedback) => {
        cardValue += feedback.value;
      });

      return Card.findByIdAndUpdate(id, {
        $push: { seenBy: req.user._id },
        totalScore: cardValue
      });
    })
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

cardRouter.post('/:id/dislike', routeGuard, (req, res, next) => {
  const { id } = req.params;
  Feedback.findOne({ card: id, user: req.user._id })
    .then((unlike) => {
      if (unlike) {
        throw new Error('USER_CANNOT_UNLIKE_THE_SAME_CARD');
      } else {
        return Feedback.create({ card: id, user: req.user._id, value: -0.3 });
      }
    })
    .then(() => {
      return Feedback.find({ card: id });
    })
    .then((feedbacks) => {
      let cardValue = 0;

      feedbacks.map((feedback) => {
        cardValue += feedback.value;
      });

      return Card.findByIdAndUpdate(id, {
        $push: { seenBy: req.user._id },
        totalScore: cardValue
      });
    })
    .then(() => {
      return Card.findByIdAndUpdate(id, {
        $push: { seenBy: req.user._id }
      });
    })
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

cardRouter.post('/:id/ignore', routeGuard, (req, res, next) => {
  const { id } = req.params;
  Feedback.findOne({ card: id, user: req.user_id })
    .then((ignore) => {
      if (ignore) {
        throw new Error('USER_CANNOT_IGNORE_THE_SAME_CARD');
      } else {
        return Feedback.create({ card: id, user: req.user._id, value: 0 });
      }
    })
    .then(() => {
      return Card.findByIdAndUpdate(id, {
        $push: { seenBy: req.user._id }
      });
    })
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

cardRouter.get('/:id/comments', routeGuard, (req, res, next) => {
  res.render('card/show-comments.hbs');
});

cardRouter.post('/:id/comment', routeGuard, (req, res, next) => {
  const { id } = req.params;
  const { commentText } = req.body;
  Comment.create({ text: commentText, user: req.user._id })
    .then((comment) => {
      return Card.findByIdAndUpdate(id, {
        $push: { comments: comment },
        $push: { seenBy: req.user._id }
      });
    })
    .then(() => {
      return Notification.create({
        card: id,
        user: req.user._id,
        comment: true
      });
    })
    .then(() => {
      res.redirect(`/`);
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = cardRouter;
