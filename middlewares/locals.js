module.exports = (req, res, next) => {
    res.locals.csrf = req.csrfToken();
    res.locals.messages = req.flash('message'),
    res.locals.errorMessages = req.flash('error'),
    res.locals.successMessages = req.flash('success'),
    next();
}