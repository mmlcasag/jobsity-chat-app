const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const csrf = require('csurf');
const fetch = require('node-fetch');

const localsMiddleware = require('./middlewares/locals');
const Post = require('./models/post');
const User = require('./models/user');
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');
const errorRoutes = require('./routes/error');

const app = express();

const MONGODB_URI = 'mongodb+srv://admin:admin@cluster-dfw5l.mongodb.net/jobsity-chat-app';
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
app.use(homeRoutes);
app.use(errorRoutes);
app.use((error, req, res, next) => {
    res.status(500).render('500', {
        title: '500 Server Side Error',
        menu: '/500',
        error: error
    });
});

mongoose
.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(result => {      
    const server = app.listen(3060);
    const io = require('./config/socket').init(server);

    io.on('connection', socket => {
        Post
        .find()
        .populate('author')
        .limit(50)
        .sort({ timestamp: -1 })
        .then(messages => {
            const chatMessages = messages.map(message => {
                return { 
                    userid: message.author._id, 
                    username: message.author.name,
                    message: message.message
                };
            })
            socket.emit('previousMessages', chatMessages.reverse());
        });
        
        socket.on('sendMessage', data => {
            let isSpecialCommand = false;
            let ticker = "";
            
            // is special command?
            if (data.message.includes('/stock=')) {
                const occurrences = data.message.split('=');

                if (occurrences.length === 2 && occurrences[0] === '/stock') {
                    isSpecialCommand = true;
                    ticker = occurrences[1];
                }
            }

            if (isSpecialCommand) {
                // calls the API
                fetch('http://localhost:3030/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        client: 'jobsity-chat-app',
                        secret: 'a5ve7t1we4r6awef4wv36w6vgdt'
                    })
                })
                .then(res => res.json())
                .then(result => {
                    // if there was an error
                    if (result.error) {
                        // emits it to the user
                        socket.emit('receivedMessage', {
                            userid: '1',
                            username: 'Chat Administrator',
                            message: 'There was an error trying the retrieve the stock quotes'
                        });
                    // if there was not an error
                    } else {
                        // calls the second endpoint
                        fetch('http://localhost:3030/stock', {
                            method: 'POST',
                            headers: { 
                                'Content-Type': 'application/json', 
                                'Authorization': 'Bearer ' + result.token
                            },
                            body: JSON.stringify({
                                ticker: ticker
                            })
                        })
                        .then(res => res.json())
                        .then(result => {
                            // if there was an error
                            if (result.error) {
                                // emits it to the user
                                socket.emit('receivedMessage', {
                                    userid: '1',
                                    username: 'Chat Administrator',
                                    message: 'There was an error trying the retrieve the stock quotes'
                                });
                            // if there was not an error
                            } else {
                                const text = {
                                    userid: '1',
                                    username: 'Chat Administrator',
                                    message: result.message.symbol + ' quote is $' + result.message.close + ' per share'
                                };
                                io.emit('receivedMessage', text);
                            }
                        });
                    }
                });
            } else {
                const post = new Post({
                    author: data.userid,
                    message: data.message,
                    timestamp: Date.now()
                });
                post.save();
                
                socket.broadcast.emit('receivedMessage', data);
            }
        });
    });
})
.catch(err => {
    console.log(err);
});