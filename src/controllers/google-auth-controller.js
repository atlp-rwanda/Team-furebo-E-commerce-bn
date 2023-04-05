// eslint-disable-next-line import/no-import-module-exports
// import jwt from 'jsonwebtoken';
// eslint-disable-next-line import/no-import-module-exports
import 'dotenv/config';

const initialize = async (req, res) => {
  res.status(200).send('<a href="/auth/google">Authenticate with Google</a>');
};
const googleFailure = async (req, res) => {
  res.send('Something went wrong');
};
const googleProtected = async (req, res) => {
  res.send('<h2>You have sucessful logged in.</h2>');
};
module.exports = { initialize, googleFailure, googleProtected };
