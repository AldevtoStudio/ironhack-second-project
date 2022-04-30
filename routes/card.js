'use strict';

const express = require('express');
const Card = require('./../models/card');
const Feedback = require('../models/feedback');
const Comment = require('./../models/comment');
const routeGuard = require('./../middleware/route-guard');
const fileUpload = require('./../middleware/file-upload');
const cardRouter = new express.Router();

cardRouter.get('/create', routeGuard, (req, res) => {
  res.render('card/create');
});

cardRouter.post('/create', routeGuard, fileUpload.single('picture'), (req, res, next) => {
  const { title, text } = req.body;
  let media;
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
});

cardRouter.post('/:id/delete', (req, res) => {
  const { id } = req.params;
  Card.findOneAndDelete({ _id: id, creator: req.user._id }).then(() => {
    res.redirect('profile');
  });
});

cardRouter.post('/:id/like', (req, res, next) => {
  const { id } = req.params;
  Feedback.findOne({ card: id, user: req.user._id }).then((like) => {
    if (like) {
      throw new Error('');
    }
  });
});

cardRouter.get('/:id/comment', routeGuard, (req, res, next) => {
  res.render('card/comment');
});

cardRouter.get('/:id/comment/:commentid/reply', routeGuard, (req, res, next) => {
  res.render('card/comment-reply');
});

cardRouter.post('/:id/comment', routeGuard, (req, res, next) => {
  const { id } = req.params;
  const { text } = req.body;
  Comment.create({ text, user: req.user._id, card: id })
    .then((comment) => {
      return Publication.findByIdAndUpdate(id, {
        $push: { comments: comment }
      });
    })
    .then(() => {
      res.redirect(`/card/${id}`);
    })
    .catch((error) => {
      next(error);
    });
});

cardRouter.post('/:id/comment/:commentid/reply', routeGuard, (req, res, next) => {
  const { id } = req.params;
  const { text } = req.body;
  Comment.create({ text, user: req.user._id, card: id })
    .then((comment) => {
      return Publication.findByIdAndUpdate(id, {
        $push: { comments: comment }
      });
    })
    .then(() => {
      res.redirect(`/card/${id}`);
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = cardRouter;
