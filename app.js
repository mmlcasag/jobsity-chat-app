const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const csrf = require('csurf');

const localsMiddleware = require('./middlewares/locals');
const authRoutes = require('./routes/auth');

const app = express();

const MONGODB_URI = 'mongodb+srv://admin:admin@mmlcasag-cvtew.mongodb.net/jobsity-chat-app';
const store = new MongoDBStore({ uri: MONGODB_URI, collection: 'sessions' });
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'gjis4gilsejo48pfs', resave: false, saveUninitialized: false, store: store }));
app.use(flash());
app.use(csrfProtection);
app.use(localsMiddleware);

app.use('/auth', authRoutes);
app.use('/', (req, res, next) => {
    res.render('home', {
        title: 'Home',
        menu: 'Home'
    });
});

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        app.listen(3060);
    })
    .catch(err => {
        console.log(err);
    });