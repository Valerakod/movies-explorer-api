const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');

const AuthentificationError = require('../errors/AuthentificationError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';
  const errorMessage = 'Not correct email or password';

  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new AuthentificationError(`${errorMessage}(${authorization})!`));
  }

  const token = authorization.replace(bearer, '');

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new AuthentificationError(`${errorMessage}!`));
  }

  req.user = payload;

  return next();
};
