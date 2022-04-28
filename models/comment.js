'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  text: {
    type: String,
    maxlength: 300,
    required: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  card: {
    type: mongoose.Types.ObjectId,
    ref: 'Card',
    required: true
  },
  replies: {
    type: [String]
  },
  value: {
    type: Number,
    default: 0.5
  }
});

const Comment = mongoose.model('Comment', schema);

module.exports = Comment;