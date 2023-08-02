const router = require('express').Router();
const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');

const {
  getMovie,
  createMovie,
  deleteMovie,
} = require('../controllers/movie');

router.use(express.json());
router.get('/movies', getMovie);
router.post(
  '/movies',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required(),
    }),
  }),
  createMovie,
);

router.delete(
  '/movies/:movieId',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      movieId: Joi.string().hex().length(24),
    }),
  }),
  deleteMovie,
);

module.exports = router;
