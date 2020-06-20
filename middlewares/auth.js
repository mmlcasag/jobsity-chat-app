module.exports = (req, res, next) => {
    if (!req.session.isSignedIn) {
        return res.redirect('/auth/sign-in');
    }
    next();
}