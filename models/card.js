'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: 80,
    required: function () {
      return !this.text && !this.media;
    }
  },
  text: {
    type: String,
    maxlength: 300,
    required: function () {
      return !this.title && !this.media;
    }
  },
  media: {
    type: String,
    required: function () {
      return !this.text && !this.title;
    }
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
  seen: {
    type: Boolean,
    default: false
  }
});

const Card = mongoose.model('Card', schema);

module.exports = Card;
