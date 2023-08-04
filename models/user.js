const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AuthentificationError = require('../errors/AuthentificationError');
const MESSAGES = require('../utils/messages');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: MESSAGES.INVALID_EMAIL,
    },
    dropDups: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Check Email and password

userSchema.statics.findUserByCredentials = function (email, password) {
  if (!password || password.length < 8) {
    throw new AuthentificationError(MESSAGES.AUTHENTIFICATION_ERROR);
  }
  return this.findOne({ email })
    .select('+password')
    .orFail(() => {
      throw new AuthentificationError(MESSAGES.AUTHENTIFICATION_ERROR);
    })
    .then((user) => bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        throw new AuthentificationError(MESSAGES.AUTHENTIFICATION_ERROR);
      }
      return user;
    }));
};

module.exports = mongoose.model('user', userSchema);
