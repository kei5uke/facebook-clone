const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(express.static('public'))

const sess = {
  secret: 'secretsecretsecret',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false,
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1)
  sess.cookie.secure = true
}

app.use(session(sess))

app.use(bodyParser.urlencoded({ extended: true }));


// GET /login page
app.get('/login', (req, res) => {
  res
    .type('text/html')
    .sendFile('/login.html', {root: 'public'});
});

// POST userinfo from /login page
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Check users
  if (username === 'admin' && password === 'password') {
    req.session.regenerate((err) => {
      req.session.username = 'admin';
      res.redirect('/');
    });
  } else {
    res.redirect('/login');
  }
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
  res.send('Hello ' + req.session.username);
});

module.exports = app;