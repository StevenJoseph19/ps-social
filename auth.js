var jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
var User = require('./models/User.js');
var express = require('express');
var router = express.Router();

// module.exports = {
//   register:
router.post('/register', (req, res) => {
  var userData = req.body;

  var user = new User(userData);

  user
    .save()
    .then((newUser) => {
      // var payload = { sub: newUser._id };

      // var token = jwt.encode(payload, '123');

      // console.log(token);

      // res.status(200).send({ token });

      createSendToken(res, newUser);
    })
    .catch((err) => res.status(500).send({ message: 'Error saving user' }));
});

//   login:
router.post('/login', async (req, res) => {
  var userData = req.body;
  var loginData = req.body;

  var user = await User.findOne({ email: userData.email });

  if (!user) {
    return res.status(401).send({ message: 'Email or Password invalid' });
  }

  bcrypt.compare(loginData.pwd, user.pwd, (err, isMatch) => {
    if (!isMatch)
      return res.status(401).send({ message: 'Email or Password invalid' });

    createSendToken(res, user);

    // var payload = {};
    // var payload = { sub: user._id };

    // var token = jwt.encode(payload, '123');

    // console.log(token);

    // res.status(200).send({ token });
  });
});

function createSendToken(res, user) {
  var payload = { sub: user._id };

  var token = jwt.encode(payload, '123');

  console.log(token);

  res.status(200).send({ token });
}

var auth = {
  router,
  checkAuthenticated: (req, res, next) => {
    if (!req.header('Authorization'))
      return res
        .status(401)
        .send({ message: 'Unauthorized. Missing Auth Header' });

    var token = req.header('Authorization').split(' ')[1];

    var payload = jwt.decode(token, '123');

    console.log(token);

    if (!payload)
      return res
        .status(401)
        .send({ message: 'Unauthorized. Auth Header Invalid' });

    req.userId = payload.sub;

    next();
  },
};

// module.exports = router;
module.exports = auth;
