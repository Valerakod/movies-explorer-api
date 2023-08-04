const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');
const MESSAGES = require('../utils/messages');

const AuthentificationError = require('../errors/AuthentificationError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';

  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new AuthentificationError(`${MESSAGES.AUTHENTIFICATION_ERROR}(${authorization})!`));
  }

  const token = authorization.replace(bearer, '');

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new AuthentificationError(MESSAGES.AUTHENTIFICATION_ERROR));
  }

  req.user = payload;

  return next();
};
