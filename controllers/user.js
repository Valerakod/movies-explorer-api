const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { constants } = require('node:http2');
const { Error } = require('mongoose');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const AuthentificationError = require('../errors/AuthentificationError');
const AlreadyExistsError = require('../errors/AlreadyExistsError');
const NotFoundError = require('../errors/NotFoundError');
const MESSAGES = require('../utils/messages');
const { JWT_SECRET } = require('../utils/constants');

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        next(new AuthentificationError(MESSAGES.AUTHENTIFICATION_ERROR));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          next(new AuthentificationError(MESSAGES.AUTHENTIFICATION_ERROR));
        }
        return res.send({
          token: jwt.sign({ _id: user._id }, JWT_SECRET, {
            expiresIn: '7d',
          }),
        });
      });
    })
    .catch(next);
};

const deleteAuth = (req, res) => {
  res
    .clearCookie('token', {
      maxAge: 0,
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    })
    .send({ message: MESSAGES.LOGGED_OUT });
};

const getUserById = (req, res, next) => {
  const id = req.params.userId ? req.params.userId : req.user._id;
  User.findById(id)
    .orFail()
    .then((user) => res.status(constants.HTTP_STATUS_OK).send(user))
    .catch((error) => {
      if (error instanceof Error.CastError) {
        next(new BadRequestError(MESSAGES.BAD_REQUEST_ERROR));
      } else if (error instanceof Error.DocumentNotFoundError) {
        next(new NotFoundError(MESSAGES.USER_NOT_FOUND_ERROR));
      } else {
        next(error);
      }
    });
};

const createNewUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(constants.HTTP_STATUS_CREATED).send({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(MESSAGES.BAD_REQUEST_ERROR));
      }
      if (err.code === 11000) {
        next(new AlreadyExistsError(MESSAGES.USER_ALREADY_EXISTS_ERROR));
      } else {
        next(err);
      }
    });
};

const editUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(
    id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(constants.HTTP_STATUS_OK).send(user))
    .catch((error) => {
      if (error instanceof Error.ValidationError) {
        next(new BadRequestError(MESSAGES.BAD_REQUEST_ERROR));
      }
      if (error.code === 11000) {
        next(new AlreadyExistsError(MESSAGES.USER_ALREADY_EXISTS_ERROR));
      } else {
        next(error);
      }
    });
};

module.exports = {
  login,
  deleteAuth,
  getUserById,
  createNewUser,
  editUserInfo,
};
