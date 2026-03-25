const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/', (req, res) => {
    res.render('index');
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

router.get('/SDetail', (req, res) => {
    res.render('SDetail');
});


router.get('/profile', (req, res) => {
    res.render('profile');
});




router.get('/login', (req, res) => {
    res.render('login');
});



module.exports = router;