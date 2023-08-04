const { constants } = require('node:http2');
const { Error } = require('mongoose');
const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const AuthorizationError = require('../errors/AuthorizationError');
const NotFoundError = require('../errors/NotFoundError');
const MESSAGES = require('../utils/messages');

const getMovie = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(constants.HTTP_STATUS_OK).send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(constants.HTTP_STATUS_CREATED).send(movie))
    .catch((error) => {
      if (error instanceof Error.ValidationError) {
        next(new BadRequestError(MESSAGES.BAD_REQUEST_ERROR));
      } else {
        next(error);
      }
    });
};

const getUserMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(200).send(movies))
    .catch((err) => {
      next(err);
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .orFail()
    .then((movie) => {
      const owner = movie.owner.toString();

      if (owner === req.user._id) {
        Movie.deleteOne(movie)
          .then(() => res.status(constants.HTTP_STATUS_OK).send(movie))
          .catch((error) => {
            console.log(error);
            next(
              new BadRequestError(
                MESSAGES.BAD_REQUEST_ERROR,
              ),
            );
          });
      } else {
        next(
          new AuthorizationError(
            MESSAGES.AUTHENTIFICATION_ERROR,
          ),
        );
      }
    })
    .catch((error) => {
      console.log(error);
      if (error instanceof Error.CastError) {
        next(new BadRequestError(MESSAGES.BAD_REQUEST_ERROR));
      } else if (error instanceof Error.DocumentNotFoundError) {
        next(new NotFoundError(MESSAGES.MOVIE_NOT_FOUND_ERROR));
      } else {
        next(error);
      }
    });
};

module.exports = {
  getMovie,
  createMovie,
  getUserMovies,
  deleteMovie,
};
