const { constants } = require('node:http2');
const { Error } = require('mongoose');
const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const AuthorizationError = require('../errors/AuthorizationError');
const NotFoundError = require('../errors/NotFoundError');

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
        next(new BadRequestError('Validation error'));
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
                `An error occurred when deleting movie ${movieId}`,
              ),
            );
          });
      } else {
        next(
          new AuthorizationError(
            `An error occurred deleting movie: ${movieId}. It is not owned by ${req.user._id}. The real owner is ${owner}`,
          ),
        );
      }
    })
    .catch((error) => {
      console.log(error);
      if (error instanceof Error.CastError) {
        next(new BadRequestError('oh no!'));
      } else if (error instanceof Error.DocumentNotFoundError) {
        next(new NotFoundError(`Movie with id ${movieId} not found`));
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
