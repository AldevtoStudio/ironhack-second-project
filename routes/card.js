'use strict';

const express = require('express');
const mongoose = require('mongoose');
const Card = require('./../models/card');
const Feedback = require('../models/feedback');
const Comment = require('./../models/comment');
const Notification = require('./../models/notification');
const routeGuard = require('./../middleware/route-guard');
const fileUpload = require('./../middleware/file-upload');
const User = require('../models/user');
const cardRouter = new express.Router();

let cardTitle;
let cardText;
let cardMedia;

cardRouter.get('/create', routeGuard, (req, res) => {
  res.render('card/create', {
    cardTitle,
    cardText,
    cardMedia,
    pageStyles: [{ style: '/styles/create-card.css' }]
  });
});

cardRouter.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const { flip } = req.query;

  console.log(flip);

  Card.findById(id)
    .populate('creator')
    .populate({ path: 'comments', populate: { path: 'user' } })
    .then((card) => {
      if (!card) {
        res.render('card/view', {
          error: { message: 'This card does not exist!' }
        });
        return;
      }

      card.comments.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      res.render('card/view', {
        card,
        pageStyles: [{ style: '/styles/singleCard.css' }],
        flip
      });
    })
    .catch((error) => {
      next(error);
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
        // cardMedia = '';
        // cardText = '';
        // cardTitle = '';
        res.redirect('/');
      })
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          res.status(404).render('card/create', {
            cardTitle,
            cardText,
            cardMedia,
            error: { message: err.message }
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
        return Feedback.create({ card: id, user: req.user._id, value: 1 });
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
      let likes = 0;

      feedbacks.map((feedback) => {
        cardValue += feedback.value;

        if (feedback.value === 1) likes++;
      });

      return Card.findByIdAndUpdate(
        id,
        {
          $push: { seenBy: req.user._id },
          totalScore: cardValue,
          likeCount: likes
        },
        { new: true }
      );
    })
    .then((card) => {
      return User.findByIdAndUpdate(
        card.creator,
        {
          $push: { totalScore: card.totalScore }
        },
        { new: true }
      );
    })
    .then((user) => {
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
        return Feedback.create({ card: id, user: req.user._id, value: -1 });
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

      return Card.findByIdAndUpdate(
        id,
        {
          $push: { seenBy: req.user._id },
          totalScore: cardValue
        },
        { new: true }
      );
    })
    .then((card) => {
      User.findByIdAndUpdate(card.creator, {
        $push: { totalScore: card.totalScore }
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

cardRouter.post('/:id/comment', routeGuard, (req, res, next) => {
  const { id } = req.params;
  const { text } = req.body;
  Comment.create({ text, user: req.user._id })
    .then((comment) => {
      return Card.findByIdAndUpdate(
        id,
        {
          $push: { comments: comment._id }
        },
        { new: true }
      );
    })
    .then(() => {
      return Notification.create({
        card: id,
        user: req.user._id,
        comment: true
      });
    })
    .then(() => {
      res.redirect(`/card/${id}`);
    })
    .catch((error) => {
      next(error);
    });
});

cardRouter.post(
  '/:id/notification/:user/delete',
  routeGuard,
  (req, res, next) => {
    const { id, user } = req.params;
    Notification.findOneAndDelete({ card: id, user })
      .then(() => {
        res.redirect('back');
      })
      .catch((error) => {
        next(error);
      });
  }
);

module.exports = cardRouter;
