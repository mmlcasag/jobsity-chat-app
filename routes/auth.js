const express = require('express');

const authController = require('../controllers/auth');
const authValidators = require('../validators/auth');

const router = express.Router();

router.get('/sign-up', authController.getSignUp);
router.post('/sign-up', authValidators.postSignUpValidator, authController.postSignUp);

router.get('/sign-in', authController.getSignIn);
router.post('/sign-in', authValidators.postSignInValidator, authController.postSignIn);

module.exports = router;