const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const crypto = require("crypto");
const path = require('path');
const sql_handler = require('./sql_handler.js');

const app = express();

if (app.get('env') === 'production') {
  app.set('trust proxy', 1)
  sess.cookie.secure = true
}

const sess = {
  secret: crypto.randomBytes(20).toString('hex'),
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false,
}
const csrfProtection = csrf({ cookie: false });


app.use(express.static('public'))
app.use(session(sess))
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug');

// GET /login page
app.get('/login', csrfProtection, (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
});

// POST userinfo from /login page
app.post('/login', csrfProtection, (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Check users
  sql = sql_handler.UserAuth(username, password);
  Promise.all([sql]).then((value) => {
    username_check = value[0][0];
    password_check = value[0][1];

    if (username === username_check && password === password_check) {
      req.session.regenerate((err) => {
        req.session.username = username;
        res.redirect('/');
      });
    } else {
      res.redirect('/login');
    }
  });
  
});

// GET /logout page
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
});

// If there is no username in session --> redirect to /login 
app.use((req, res, next) => {
    if (req.session.username) {
      next();
    } else {
      res.redirect('/login');
    }
});

app.get('/', (req, res) => {
  username = req.session.username;
  sql = sql_handler.showFollowerPost(username);
  Promise.all([sql]).then((value) => {
    res.render('home', {'posts': value[0]});
  })
});

// Default Error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

module.exports = app;