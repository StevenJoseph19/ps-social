const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

//Defining a schema
const userSchema = new Schema({
  email: String,
  pwd: String,
  name: String,
  description: String,
});

userSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('pwd')) return next();

  bcrypt.hash(user.pwd, null, null, (err, hash) => {
    if (err) return next(err);

    user.pwd = hash;
    console.log(hash);
    next();
  });
});

//Compiling our schema into a Model.
const User = mongoose.model('User', userSchema);
module.exports = User;
