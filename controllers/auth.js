const bcrypt = require('bcrypt');
const mailer = require('../config/mailer');

const User = require('../models/user');
const { validationResult } = require('express-validator');

const getSignUpViewParams = (name = null, email = null, password = null, confirmPassword = null, validationErrors = []) => {
    return {
        title: 'Sign Up',
        menu: 'Sign Up',
        form: {
            name: name,
            email: (email !== '@' ? email : ''),
            password: password,
            confirmPassword: confirmPassword
        },
        validationErrors: validationErrors
    };
}

module.exports.getSignUp = (req, res, next) => {
    const params = getSignUpViewParams();
    return res.status(200).render('auth/sign-up', params);
}

module.exports.postSignUp = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const validationErrors = validationResult(req).array();
    
    if (validationErrors.length > 0) {
        const params = getSignUpViewParams(name, email, password, confirmPassword, validationErrors);
        return res.status(422).render('auth/sign-up', params);
    }

    bcrypt
    .hash(password, 10)
    .then(hashedPassword => {
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword
        });
        return user.save();
    })
    .then(result => {
        return mailer.sendMail({
            from: '"Jobsity Chat App" <chat-app@jobsity.com>',
            to: email,
            subject: 'Welcome to Jobsity Chat App',
            text: 'Welcome to Jobsity Chat App. Thanks for signing up at Jobsity Chat App. You are now ready to use our app and enjoy its awesome features!',
            html: '<h1>Welcome to Jobsity Chat App<h1><br><p>Thanks for signing up at Jobsity Chat App.</p><br><p>You are now ready to use our app and enjoy its awesome features!</p>'
        });
    })
    .then(result => {
        req.flash('success', 'You have successfully signed up. Now you have to sign in.');
        return res.redirect('/auth/sign-in');
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

const getSignInViewParams = (email = null, password = null, validationErrors = []) => {
    return {
        title: 'Sign In',
        menu: 'Sign In',
        form: {
            email: (email !== '@' ? email : ''),
            password: password
        },
        validationErrors: validationErrors
    };
}

module.exports.getSignIn = (req, res, next) => {
    const params = getSignInViewParams();
    return res.status(200).render('auth/sign-in', params);
}

module.exports.postSignIn = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    
    const validationErrors = validationResult(req).array();
    
    if (validationErrors.length > 0) {
        const params = getSignInViewParams(email, password, validationErrors);
        return res.status(422).render('auth/sign-in', params);
    }
    
    if (validationErrors.length === 0) {
        User
        .findOne({ email: email })
        .then(user => {
            if (!user) {
                validationErrors.push({
                    value: email,
                    msg: 'Invalid e-mail or password',
                    param: 'email',
                    location: 'body',
                });
                const params = getSignInViewParams(email, password, validationErrors);
                return res.status(422).render('auth/sign-in', params);
            } else {
                bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.user = user;
                        req.session.save(() => {
                            req.flash('success', 'You have successfully signed in. Welcome!');
                            return res.redirect('/');
                        });
                    } else {
                        validationErrors.push({
                            value: password,
                            msg: 'Invalid e-mail or password',
                            param: 'password',
                            location: 'body',
                        });
                        const params = getSignInViewParams(email, password, validationErrors);
                        return res.status(401).render('auth/sign-in', params);
                    }
                })
            }
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    }
}