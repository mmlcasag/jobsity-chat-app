module.exports.get404 = (req, res, next) => {
    res.status(404).render('404', {
        title: '404 Page Not Found',
        menu: '/404'
    });
}

module.exports.get500 = (req, res, next) => {
    res.status(500).render('500', {
        title: '500 Server Side Error',
        menu: '/500'
    });
}