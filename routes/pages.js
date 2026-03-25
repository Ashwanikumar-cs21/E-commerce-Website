const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/sell', (req, res) => {
    res.render('sell');
});

router.get('/Home', (req, res) => {
    res.render('Home');
});

router.get('/about', (req, res) => {
    res.render('about');
});


router.get('/profile', (req, res) => {
    res.render('profile');
});


module.exports = router;