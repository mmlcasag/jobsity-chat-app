const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/auth', authRoutes);

app.use('/', (req, res, next) => {
    res.render('home', {
        title: 'Home',
        menu: 'Home'
    });
});

mongoose.connect('mongodb+srv://admin:admin@mmlcasag-cvtew.mongodb.net/jobsity-chat-app', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        app.listen(3060);
    })
    .catch(err => {
        console.log(err);
    });