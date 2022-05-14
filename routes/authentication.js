'use strict';

const { Router } = require('express');
const passport = require('passport');
const router = new Router();

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up', {
    pageStyles: [{ style: '/styles/sign-up.css' }]
  });
});

router.post(
  '/sign-up',
  passport.authenticate('local-sign-up', {
    successRedirect: '/',
    failureRedirect: '/auth/sign-up'
  })
);

router.get('/sign-in', (req, res, next) => {
  res.render('sign-in', {
    pageStyles: [{ style: '/styles/sign-in.css' }]
  });
});

router.post(
  '/sign-in',
  passport.authenticate('local-sign-in', {
    successRedirect: '/',
    failureRedirect: '/auth/sign-in'
  })
);

router.get(
  '/github',
  passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/auth/sign-in'
  })
);

router.get(
  '/github-callback',
  passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/auth/sign-in'
  })
);

router.get(
  '/google',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/auth/sign-in'
  })
);

router.get(
  '/google-callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/auth/sign-in'
  })
);

router.get(
  '/twitter',
  passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/auth/sign-in'
  })
);

router.get(
  '/twitter-callback',
  passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/auth/sign-in'
  })
);

router.post('/sign-out', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
