require('dotenv').config();
const express = require('express');
const BodyParser = require('body-parser');
const mongoose = require('mongoose');
const {
  celebrate, Joi, Segments, errors,
} = require('celebrate');

const cors = require('./middlewares/cors');
const NotFoundError = require('./errors/NotFoundError');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error');
const userRoutes = require('./routes/user');
const movieRoutes = require('./routes/movie');
const { login, createNewUser, deleteAuth } = require('./controllers/user');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, MONGO_URI } = process.env;
const app = express();

app.use(BodyParser.json());
app.use(cors);

app.use(requestLogger);
app.use(express.json());
// подключаемся к серверу mongo
mongoose.connect(MONGO_URI).then(() => {
  console.log('Connected to db mongo');
});
app.post(
  '/signin',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createNewUser,
);
app.use(auth);
app.use(userRoutes);
app.use(movieRoutes);

app.delete('/signout', deleteAuth);

app.all('*', (req, res, next) => next(new NotFoundError('Route not found')));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT);
