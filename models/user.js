'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Name is required.']
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: [
      true,
      'Email already registered, <a href="/auth/sign-in">sign in</a> instead'
    ],
    lowercase: true,
    trim: true
  },
  passwordHashAndSalt: {
    type: String,
    required: [
      function () {
        return !this.accessToken;
      },
      'Password is required'
    ]
  },
  accessToken: {
    type: String
  },
  lastStrategy: String,
  picture: {
    type: String,
    default: 'https://cdn.landesa.org/wp-content/uploads/default-user-image.png'
  },
  totalScore: [
    {
      type: Number
    }
  ]
});

const User = mongoose.model('User', schema);

module.exports = User;
