const express = require('express');

const authController = require('../controllers/auth');
const authValidators = require('../validators/auth');

const router = express.Router();

router.get('/sign-up', authController.getSignUp);
router.post('/sign-up', authValidators.postSignUpValidator, authController.postSignUp);

router.get('/sign-in', authController.getSignIn);
router.post('/sign-in', authValidators.postSignInValidator, authController.postSignIn);

router.get('/reset-password', authController.getResetPassword);
router.post('/reset-password', authValidators.postResetPasswordValidator, authController.postResetPassword);

router.get('/update-password/:token', authController.getUpdatePassword);
router.post('/update-password', authValidators.postUpdatePasswordValidator, authController.postUpdatePassword);

router.get('/sign-out', authController.getSignOut);

module.exports = router;