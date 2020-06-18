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
    console.log(password);
    console.log(confirmPassword);
}

module.exports.getSignIn = (req, res, next) => {
    res.render('auth/sign-in', {
        title: 'Sign In',
        menu: 'Sign In'
    });
}