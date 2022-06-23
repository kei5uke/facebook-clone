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
  start: 0
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
        req.session.start = 0;
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

// Main Home Page
// Shows all the followers post
app.get('/', (req, res) => {
  var username = req.session.username;
  sql = sql_handler.getFollowingPost(username, 0, 3);
  Promise.all([sql]).then((value) => {
    if (value){
      res.render('home', {'posts': value[0]});
      req.session.start = value[0].length;
      req.session.save()
    }else{
      res.render('home', {'message': "LOL You don't have friends"})
    }
  })
});

app.get('/friend', (req, res) => {
  var username = req.session.username;
  requests = sql_handler.getFriendRequests(username);
  following = sql_handler.getFollowingList(username);
  follower = sql_handler.getFollowerList(username);
  Promise.all([requests, following, follower]).then((value) => {
      if (value){  
        res.render('friend', {'requests':value[0],'followings':value[1], 'followers':value[2]})  
      }else{
        res.render('friend', {'message': "LOL You don't have friends"})
      }
  });
});

// Used when user wants to followe back
app.post('/add_friend', (req, res) => {
  var followed_id = null;
  var follower_id = null;
  if(req.body.username){
    sql1 = sql_handler.getUserId(req.session.username);
    sql2 = sql_handler.getUserId(req.body.username);
    Promise.all([sql1, sql2]).then((value) => {
        if (value[0].length == 0 || value[1].length == 0){
            console.log('The user does not exist');
            return;
        }
        follower_id = value[0][0].id;
        followed_id = value[1][0].id;

        sql3 = sql_handler.addFollower(follower_id, followed_id);
        Promise.all([sql3]).then((value) => {
          if (value == 0){
              console.log('Something Went Wrong');
              return;
          }
          res.sendStatus(204);
        });
    });
  }else{
    res.sendStatus(403);
  }
});

// When user request more posts
app.post('/update', (req, res) => {
  var username = req.session.username;
  var start = req.session.start;
  sql = sql_handler.getFollowingPost(username, start, 3);
  Promise.all([sql]).then((value) => {
    if(value == 0){
      res.sendStatus(204);
      return;
    }
    //console.log(value[0]);
    res.send(value[0]);
    req.session.start += value[0].length;
    req.session.save()
  });

});

app.get('/mypage', (req, res) => {
  var username = req.session.username;
  sql = sql_handler.getUserPosts(username);
  Promise.all([sql]).then((value) => {
    if (value){  
      res.render('mypage', {'username':username, 'myposts':value[0]}); 
    }else{
      res.render('mypage', {'message': "You don't have any post"})
    }
  });
});

// When user refresh the page, reset the session value
app.post('/refresh', (req, res) => {
  req.session.start = 0;
  req.session.save();
  res.redirect('/');
});

// Default Error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

module.exports = app;