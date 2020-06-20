const { check } = require('express-validator');

const User = require('../models/user');

module.exports.postSignUpValidator = [
    check('name')
        .not().isEmpty().withMessage('Please enter your name')
        .bail()
        .trim(),
    check('email')
        .not().isEmpty().withMessage('Please enter your e-mail address')
        .bail()
        .isEmail().withMessage('Please enter a valid e-mail address')
        .bail()
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(user => {
                    if (user) {
                        return Promise.reject('You have already signed up to our chat app.');
                    }
                })
        })
        .bail()
        .normalizeEmail(),
    check('password')
        .not().isEmpty().withMessage('Please enter your password')
        .bail()
        .isLength({ min: 6 }).withMessage('Your password must be at least 6 characters long')
        .bail()
        .trim(),
    check('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        })
        .bail()
        .trim()
];

module.exports.postSignInValidator = [
    check('email')
        .not().isEmpty().withMessage('Please enter your e-mail address')
        .bail()
        .isEmail().withMessage('Please enter a valid e-mail address')
        .bail()
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(user => {
                    if (!user) {
                        return Promise.reject('Invalid e-mail or password');
                    }
                })
        })
        .bail()
        .normalizeEmail(),
    check('password')
        .not().isEmpty().withMessage('Please enter your password')
        .bail()
        .isLength({ min: 6 }).withMessage('Your password must be at least 6 characters long')
        .bail()
        .trim(),
];

module.exports.postResetPasswordValidator = [
    check('email')
        .not().isEmpty().withMessage('Please enter your e-mail address')
        .bail()
        .isEmail().withMessage('Please enter a valid e-mail address')
        .bail()
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(user => {
                    if (!user) {
                        return Promise.reject('You have not signed up to our chat app yet');
                    }
                })
        })
        .bail()
        .normalizeEmail()
];

module.exports.postUpdatePasswordValidator = [
    check('token')
        .custom((value, { req }) => {
            return User.findOne({ resetPasswordToken: value, resetPasswordExpiration: {$gt: Date.now()} })
                .then(user => {
                    if (!user) {
                        return Promise.reject('Token invalid or expired');
                    }
                })
        }),
    check('password')
        .not().isEmpty().withMessage('Please enter your password')
        .bail()
        .isLength({ min: 6 }).withMessage('Your password must be at least 6 characters long')
        .bail()
        .trim(),
    check('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        })
        .bail()
        .trim()
];