const { config } = require('dotenv');

const { NODE_ENV } = process.env;

if (NODE_ENV === 'production') {
  config();
}

const { JWT_SECRET = 'dev-secret' } = process.env;

module.exports = {
  JWT_SECRET,
  NODE_ENV,
};
