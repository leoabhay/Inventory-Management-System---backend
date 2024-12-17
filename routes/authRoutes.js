const express = require('express');
const {signup, login, profile} = require('../controllers/authController');
const {authorize} = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile',authorize, profile);

module.exports = router;