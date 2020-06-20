const crypto = require('crypto');

const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const mailer = require('../config/mailer');
const User = require('../models/user');

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
            text: 'Thanks for signing up at Jobsity Chat App. You are now ready to use our app and enjoy its awesome features! Start now',
            html: '<p>Thanks for signing up at Jobsity Chat App.</p><p>You are now ready to use our app and enjoy its awesome features!</p><p><a href="http://localhost:3060/auth/sign-in">Start now</a></p>'
        });
    })
    .then(result => {
        req.flash('success', 'You have successfully signed up. We have sent you a confirmation e-mail. Proceed to sign in now.');
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
                        req.session.isSignedIn = true;
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

const getResetPasswordViewParams = (email = null, validationErrors = []) => {
    return {
        title: 'Forgot Your Password?',
        menu: 'Reset Your Password',
        form: {
            email: (email !== '@' ? email : '')
        },
        validationErrors: validationErrors
    };
}

module.exports.getResetPassword = (req, res, next) => {
    const params = getResetPasswordViewParams();
    return res.status(200).render('auth/reset-password', params);
}

module.exports.postResetPassword = (req, res, next) => {
    const email = req.body.email;
    
    const validationErrors = validationResult(req).array();
    
    if (validationErrors.length > 0) {
        const params = getResetPasswordViewParams(email, validationErrors);
        return res.status(422).render('auth/reset-password', params);
    }
    
    crypto
    .randomBytes(32, (err, buffer) => {
        if (err) {
            validationErrors.push({
                value: email,
                msg: 'Error trying to generate a token',
                param: 'email',
                location: 'body',
            });
            const params = getResetPasswordViewParams(email, validationErrors);
            return res.status(422).render('auth/reset-password', params);
        } else {
            const token = buffer.toString('hex');
            
            User
            .findOne({ email: email })
            .then(user => {
                if (!user) {
                    validationErrors.push({
                        value: email,
                        msg: 'You have not signed up to our chat app yet',
                        param: 'email',
                        location: 'body',
                    });
                    const params = getSignInViewParams(email, password, validationErrors);
                    return res.status(422).render('auth/reset-password', params);
                } else {
                    user.resetPasswordToken = token;
                    user.resetPasswordExpiration = Date.now() + 3600000;
                    return user.save()
                    .then(result => {
                        return mailer.sendMail({
                            from: '"Jobsity Chat App" <chat-app@jobsity.com>',
                            to: email,
                            subject: 'Forgot Your Password?',
                            text: 'You have requested to reset your password. Click here to set a new password.',
                            html: '<p>You have requested to reset your password.</p><p>Click <a href="http://localhost:3060/auth/update-password/' + token + '">here</a> to set a new password.</p>'
                        });
                    })
                    .then(result => {
                        req.flash('success', 'We have sent you an e-mail with the instructions to change your password.');
                        return res.redirect('/auth/reset-password');
                    })
                }
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
        }
    });
}

const getUpdatePasswordViewParams = (token = null, password = null, confirmPassword = null, validationErrors = []) => {
    return {
        title: 'Update Your Password',
        menu: 'Update Your Password',
        form: {
            token: token,
            password: password,
            confirmPassword: confirmPassword
        },
        validationErrors: validationErrors
    };
}

module.exports.getUpdatePassword = (req, res, next) => {
    const token = req.params.token;

    const params = getUpdatePasswordViewParams(token);
    return res.status(200).render('auth/update-password', params);
}

module.exports.postUpdatePassword = (req, res, next) => {
    const token = req.body.token;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    
    const validationErrors = validationResult(req).array();
    
    if (validationErrors.length > 0) {
        const params = getUpdatePasswordViewParams(token, password, confirmPassword, validationErrors);
        return res.status(422).render('auth/update-password', params);
    }

    User
    .findOne({ resetPasswordToken: token, resetPasswordExpiration: {$gt: Date.now()} })
    .then(user => {
        if (!user) {
            const params = getResetPasswordViewParams();
            return res.status(422).render('auth/reset-password', params);
        } else {
            bcrypt
            .hash(password, 10)
            .then(hashedPassword => {
                user.password = hashedPassword;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpiration = undefined;
                return user.save();
            })
            .then(result => {
                req.flash('success', 'Your password has been updated. Proceed to sign in now.');
                return res.redirect('/auth/sign-in');
            });
        }
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

module.exports.getSignOut = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        }
        res.redirect('/');
    });
}