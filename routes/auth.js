const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/sign-up', authController.getSignUp);
router.post('/sign-up', authController.postSignUp);
router.get('/sign-in', authController.getSignIn);

module.exports = router;