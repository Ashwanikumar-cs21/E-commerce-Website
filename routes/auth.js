const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

// Auth actions
router.post('/login', authController.login);
router.post('/register', authController.register);

// Auth page GET routes
router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

// Pages
router.get('/home', (req, res) => res.render('Home'));
router.get('/sell', (req, res) => res.render('sell'));
router.get('/about', (req, res) => res.render('about'));
router.get('/profile', (req, res) => {
  const user = req.session.user;
  if (!user) return res.redirect('/login');
  res.render('profile', { user, firstLetter: user.name.charAt(0).toUpperCase() });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});
router.get('/sdetail', (req, res) => res.render('SDetail'));

module.exports = router;
