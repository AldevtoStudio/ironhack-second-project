'use strict';

const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('./models/user');
const bcryptjs = require('bcryptjs');

passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then((user) => {
      callback(null, user);
    })
    .catch((error) => {
      callback(error);
    });
});

passport.use(
  'local-sign-up',
  new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true
    },
    (req, email, password, callback) => {
      const name = req.body.name;
      bcryptjs
        .hash(password, 10)
        .then((hash) => {
          return User.create({
            name,
            email,
            passwordHashAndSalt: hash,
            lastStrategy: 'local'
          });
        })
        .then((user) => {
          callback(null, user);
        })
        .catch((error) => {
          callback(error);
        });
    }
  )
);

passport.use(
  'local-sign-in',
  new LocalStrategy({ usernameField: 'email' }, (email, password, callback) => {
    let user;
    User.findOne({
      email
    })
      .then((document) => {
        user = document;
        if (!user) throw new Error('User does not exist.');

        if (!user.passwordHashAndSalt)
          throw new Error(`Please, sign in with ${user.lastStrategy}`);

        return bcryptjs.compare(password, user.passwordHashAndSalt);
      })
      .then((passwordMatchesHash) => {
        if (passwordMatchesHash) {
          callback(null, user);
        } else {
          callback(new Error('Wrong password.'));
        }
      })
      .catch((error) => {
        callback(error);
      });
  })
);

passport.use(
  'github',
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK,
      scope: 'user:email'
    },
    (accessToken, refreshToken, profile, callback) => {
      const {
        displayName: name,
        emails,
        photos: [{ value: photo } = {}] = []
      } = profile;
      const primaryEmail = emails[0].value;
      User.findOne({ email: primaryEmail })
        .then((user) => {
          if (user) {
            return Promise.resolve(user);
          } else {
            return User.create({
              email: primaryEmail,
              picture: photo,
              name,
              accessToken,
              lastStrategy: 'github'
            });
          }
        })
        .then((user) => {
          callback(null, user);
        })
        .catch((error) => {
          callback(error);
        });
    }
  )
);

passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
      scope: ['email', 'profile']
    },
    (accessToken, refreshToken, profile, callback) => {
      const {
        displayName: name,
        emails,
        photos: [{ value: photo } = {}] = []
      } = profile;
      const primaryEmail = emails[0].value;
      User.findOne({ email: primaryEmail })
        .then((user) => {
          if (user) {
            return Promise.resolve(user);
          } else {
            return User.create({
              email: primaryEmail,
              picture: photo,
              name,
              accessToken,
              lastStrategy: 'google'
            });
          }
        })
        .then((user) => {
          callback(null, user);
        })
        .catch((error) => {
          callback(error);
        });
    }
  )
);

passport.use(
  'twitter',
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CLIENT_ID,
      consumerSecret: process.env.TWITTER_CLIENT_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK,
      includeEmail: true,
      includeStatus: false,
      includeEntities: false,
      scope: ['email', 'profile']
    },
    (accessToken, refreshToken, profile, callback) => {
      console.log(profile);
      const {
        displayName: name,
        emails,
        photos: [{ value: photo } = {}] = []
      } = profile;
      const primaryEmail = emails[0].value;
      User.findOne({ email: primaryEmail })
        .then((user) => {
          if (user) {
            return Promise.resolve(user);
          } else {
            return User.create({
              email: primaryEmail,
              picture: photo,
              name,
              accessToken,
              lastStrategy: 'twitter'
            });
          }
        })
        .then((user) => {
          callback(null, user);
        })
        .catch((error) => {
          callback(error);
        });
    }
  )
);
