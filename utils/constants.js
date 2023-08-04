require('dotenv').config();

const {
  JWT_SECRET = 'dev-key',
  MONGODB = 'mongodb://localhost:27017/bitfilmsdb',
  PORT = 3000,
  NODE_ENV = 'dev',
} = process.env;
const REGEX_URL = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$/;

module.exports = {
  JWT_SECRET,
  MONGODB,
  PORT,
  NODE_ENV,
  REGEX_URL,
};
