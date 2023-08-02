const router = require('express').Router();
const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');

const {
  getAllUsers,
  getUserById,
  editUserInfo,
} = require('../controllers/user');

router.use(express.json());
router.get('/users', getAllUsers);
router.get('/users/me', getUserById);
router.get(
  '/users/:userId',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
    }),
  }),
  getUserById,
);
router.patch(
  '/users/me',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  editUserInfo,
);

module.exports = router;
