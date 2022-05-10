'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: [18, 'Title max length is 18.'],
    required: [true, 'Title is required.']
  },
  text: {
    type: String,
    maxlength: [246, 'Description max length is 246.'],
    required: [true, 'Description is required.']
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
    required: true,
    default: 0
  },
  comments: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  totalScore: {
    type: Number,
    default: 0
  },
  seenBy: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  ]
});

const Card = mongoose.model('Card', schema);

module.exports = Card;
