var express = require('express');
var cors = require('cors');
var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var app = express();
// const bcrypt = require('bcrypt-nodejs');

var User = require('./models/User.js');
var Post = require('./models/Post.js');
var auth = require('./auth.js');

// var posts = [{ message: 'hello' }, { message: 'hi' }];

// app.use(cors());
const corsOptions = {
  origin: 'http://ps-social-steve.s3-website-us-east-1.amazonaws.com',
  // credentials: true, //access-control-allow-credentials:true
  credentials: false, //access-control-allow-credentials: false
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.text()); // To parse the incoming requests with text payload
app.use(express.json()); // To parse the incoming requests with JSON payload

// function checkAuthenticated(req, res, next) {
//   if (!req.header('Authorization'))
//     return res
//       .status(401)
//       .send({ message: 'Unauthorized. Missing Auth Header' });

//   var token = req.header('Authorization').split(' ')[1];

//   var payload = jwt.decode(token, '123');

//   console.log(token);

//   if (!payload)
//     return res
//       .status(401)
//       .send({ message: 'Unauthorized. Auth Header Invalid' });

//   req.userId = payload.sub;

//   next();
// }

// app.get('/posts', async (req, res) => {
// res.send(posts);
app.get('/posts/:id', async (req, res) => {
  // var author = '66c76a1c2bbae9c933ffb386';
  var author = req.params.id;
  var posts = await Post.find({ author });
  res.send(posts);
});

app.post('/post', auth.checkAuthenticated, (req, res) => {
  var postData = req.body;
  // postData.author = '66c76a1c2bbae9c933ffb386';
  postData.author = req.userId;

  // var post = new Post(req.body);
  var post = new Post(postData);

  post
    .save()
    .then((result) => {
      console.log('Successfully saved the product');

      res.status(201).send({ message: 'Saved successfully' });
    })
    .catch((err) => {
      console.log('saving post error');
      res.status(500).send({ message: 'saving post error' });
    });
});

// app.get('/users', checkAuthenticated, async (req, res) => {
// app.get('/users', auth.checkAuthenticated, async (req, res) => {
app.get('/users', async (req, res) => {
  try {
    // console.log(req.userId);
    var users = await User.find({}, '-pwd -__v');
    res.send(users);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get('/profile/:id', async (req, res) => {
  // console.log(req.params.id);
  try {
    var user = await User.findById(req.params.id, '-pwd -__v');
    res.send(user);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// app.post('/register', (req, res) => {
//   // console.log(req.body));
//   var userData = req.body;
//   // console.log(userData.email);

//   var user = new User(userData);

//   user
//     .save()
//     .then((result) => {
//       console.log('Successfully saved the product');
//       // res.sendStatus(200); -- must send JSON
//       res.status(201).send({ message: 'Saved successfully' });
//     })
//     .catch((err) => console.log('saving user error'));
// });

// app.post('/register', auth.register);

// app.post('/login', async (req, res) => {
//   var userData = req.body;
//   var loginData = req.body;

//   var user = await User.findOne({ email: userData.email });

//   if (!user) {
//     return res.status(401).send({ message: 'Email or Password invalid' });
//   }

//   bcrypt.compare(loginData.pwd, user.pwd, (err, isMatch) => {
//     if (!isMatch)
//       return res.status(401).send({ message: 'Email or Password invalid' });

//     var payload = {};

//     var token = jwt.encode(payload, '123');

//     console.log(token);

//     res.status(200).send({ token });
//   });

//   // if (loginData.pwd != user.pwd) {
//   // return res.status(401).send({ message: 'Email or Password invalid' });
//   // }

//   // var payload = {};

//   // var token = jwt.encode(payload, '123');

//   // console.log(user);
//   // console.log(token);

//   // res.status(200).send({ message: 'Found User' });

//   // res.status(200).send({ token });
// });

// app.post('/login', auth.login);

mongoose
  .connect(
    // 'mongodb+srv://stevesam1927:AGOvXbftedGNIP3x@pssocial.vymit.mongodb.net/?retryWrites=true&w=majority&appName=pssocial'
    'mongodb+srv://stevesam1927:AGOvXbftedGNIP3x@pssocial.nv96k.mongodb.net/?retryWrites=true&w=majority&appName=pssocial'
  )
  .then((res) => {
    console.log('Connected to MongoDB Atlas!');
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB Atlas!');
  });

// app.use('/auth', auth);
app.use('/auth', auth.router);

app.listen(process.env.PORT || 3000);
