const express = require('express');
const Card = require('./../models/card');
const routeGuard = require('./../middleware/route-guard');
const fileUpload = require('./../middleware/file-upload');
const cardRouter = new express.Router();

cardRouter.get('/create', routeGuard, (req, res) => {
  res.render('/card/create');
});

cardRouter.post(
  '/create',
  routeGuard,
  fileUpload.single('picture'),
  (req, res, next) => {
    const { title, text } = req.body;
    let media;
    if (req.file) {
      media = req.file.path;
    }
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
