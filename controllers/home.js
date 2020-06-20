module.exports.getHome = (req, res, next) => {
    res.status(200).render('home', {
        title: 'Home',
        menu: 'Home'
    });
}

module.exports.getChat = (req, res, next) => {
    res.status(200).render('chat', {
        title: 'Chat',
        menu: 'Chat'
    });
}