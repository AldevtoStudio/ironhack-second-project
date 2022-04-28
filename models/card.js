'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: 80
  },
  text: {
    type: String,
    maxlength: 300
  },
  media: {
    type: String
  },
  creator: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  likeCount: {
    type: Number,
    required: true
  },
  comment: {
    type: [mongoose.Types.ObjectId],
    ref: 'Comment'
  },
  totalScore: {
    type: Number,
    default: 0
  }
});

const Card = mongoose.model('Card', schema);

module.exports = Card;
