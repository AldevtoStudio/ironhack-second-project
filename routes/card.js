'use strict';

const express = require('express');
const Card = require('./../models/card');
const Feedback = require('../models/feedback');
const routeGuard = require('./../middleware/route-guard');
const fileUpload = require('./../middleware/file-upload');
const cardRouter = new express.Router();

cardRouter.get('/create', routeGuard, (req, res) => {
  res.render('card/create');
});

cardRouter.post(
  '/create',
  routeGuard,
  fileUpload.single('media'),
  (req, res, next) => {
    const { title, text } = req.body;
    let media;
    console.log('Media: ' + media);
    if (req.file) media = req.file.path;

    Card.create({
      title,
      media,
      text,
      creator: req.user._id
    })
      .then(() => {
        res.redirect('/');
      })
      .catch((err) => {
        next(err);
      });
  }
);

cardRouter.post('/:id/delete', (req, res) => {
  const { id } = req.params;
  Card.findOneAndDelete({ _id: id, creator: req.user._id }).then(() => {
    res.redirect('profile');
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
      return Feedback.count({ publication: id });
    })
    .then((feedbacks) => {
      return Card.findByIdAndUpdate(id, { feedbacks, seen: true });
    })
    .then(() => {
      res.end();
    })
    .catch((error) => {
      next(error);
    });
});

cardRouter.post('/:id/unlike', routeGuard, (req, res, next) => {
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
      return Feedback.count({ card: id });
    })
    .then((feedbacks) => {
      return Card.findByIdAndUpdate(id, { feedbacks, seen: true });
    })
    .then(() => {
      res.end();
    })
    .catch((error) => {
      next(error);
    });
});

cardRouter.post('/:id/ignore', (req, res, next) => {
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
      return Feedback.count({ card: id });
    })
    .then((feedbacks) => {
      return Card.findByIdAndUpdate(id, { feedbacks, seen: true });
    })
    .then(() => {
      res.end();
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = cardRouter;
