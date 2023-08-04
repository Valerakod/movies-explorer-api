const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const auth = require('../middlewares/auth');
const { login, createNewUser, deleteAuth } = require('../controllers/user');
const userRoutes = require('./user');
const movieRoutes = require('./movie');
const { signInValidation, signUpValidation } = require('../validation/user');

router.use(
  '/signin',
  signInValidation,
  login,
);
router.use(
  '/signup',
  signUpValidation,
  createNewUser,
);
router.use(auth);
router.use(userRoutes);
router.use(movieRoutes);

router.use('/signout', deleteAuth);

router.all('*', (req, res, next) => next(new NotFoundError('Route not found')));

module.exports = router;
