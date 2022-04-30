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

cardRouter.post('/:id/like', (req, res, next) => {
  const { id } = req.params;
  Feedback.findOne({ card: id, user: req.user._id }).then((like) => {
    if (like) {
      throw new Error('');
    }
  });
});

module.exports = cardRouter;
