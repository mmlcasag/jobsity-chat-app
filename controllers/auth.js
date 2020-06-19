const bcrypt = require('bcrypt');
const mailer = require('../config/mailer');

const User = require('../models/user');
const { validationResult } = require('express-validator');

module.exports.getSignUp = (req, res, next) => {
    return res.status(200).render('auth/sign-up', {
        title: 'Sign Up',
        menu: 'Sign Up',
        form: {
            name: null,
            email: null,
            password: null,
            confirmPassword: null
        },
        validationErrors: []
    });
}

module.exports.postSignUp = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const validationErrors = validationResult(req).array();
    
    if (validationErrors.length > 0) {
        return res.status(422).render('auth/sign-up', {
            title: 'Sign Up',
            menu: 'Sign Up',
            form: {
                name: name, 
                email: (email !== '@' ? email : ''),
                password: password,
                confirmPassword: confirmPassword
            },
            validationErrors: validationErrors
        });
    }
    
    bcrypt.hash(password, 10)
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
            req.flash('success', 'You have successfully signed up. Welcome to Jobsity Chat App!');
            return res.redirect('/auth/sign-in');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

module.exports.getSignIn = (req, res, next) => {
    return res.render('auth/sign-in', {
        title: 'Sign In',
        menu: 'Sign In',
        form: {
            email: null,
            password: null
        },
        validationErrors: []
    });
}

module.exports.postSignIn = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    
    const validationErrors = validationResult(req).array();
    
    if (validationErrors.length > 0) {
        return res.status(422).render('auth/sign-in', {
            title: 'Sign In',
            menu: 'Sign In',
            form: {
                email: (email !== '@' ? email : ''),
                password: password
            },
            validationErrors: validationErrors
        });
    }
    
    

}