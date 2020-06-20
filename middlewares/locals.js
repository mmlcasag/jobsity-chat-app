module.exports = (req, res, next) => {
    res.locals.csrf = req.csrfToken();
    
    res.locals.messages = req.flash('message'),
    res.locals.errorMessages = req.flash('error'),
    res.locals.successMessages = req.flash('success'),
    
    res.locals.isSignedIn = req.session.isSignedIn;
    
    if (req.session.user) {
        res.locals.userid = req.session.user._id;
        res.locals.username = req.session.user.name;
    } else {
        res.locals.userid = null;
        res.locals.username = null;
    }
    
    next();
}