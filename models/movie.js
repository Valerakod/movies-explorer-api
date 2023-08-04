const mongoose = require('mongoose');
const validator = require('validator');
const MESSAGES = require('../utils/messages');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (avatar) => validator.isURL(avatar),
      message: MESSAGES.INVALID_LINK,
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (avatar) => validator.isURL(avatar),
      message: MESSAGES.INVALID_LINK,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (avatar) => validator.isURL(avatar),
      message: MESSAGES.INVALID_LINK,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
