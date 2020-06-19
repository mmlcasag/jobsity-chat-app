const bcrypt = require('bcrypt');
const mailer = require('../config/mailer');

const User = require('../models/user');

module.exports.getSignUp = (req, res, next) => {
    res.render('auth/sign-up', {
        title: 'Sign Up',
        menu: 'Sign Up'
    });
}

module.exports.postSignUp = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    console.log(name);
    console.log(email);
    
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
            res.redirect('/auth/sign-in');
        })
        .catch(err => {
            console.log(err);
        });
}

module.exports.getSignIn = (req, res, next) => {
    res.render('auth/sign-in', {
        title: 'Sign In',
        menu: 'Sign In'
    });
}