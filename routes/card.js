'use strict';

const express = require('express');
const Feedback = require('../models/feedback');
const routeGuard = require('./../middleware/route-guard');
const Card = require('./../models/card');
const cardRouter = new express.Router();

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
