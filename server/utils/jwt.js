const jwt = require('jsonwebtoken');

const JWT_SECRET = 'mysecretkey123';
const TOKEN_EXPIRY_TIME = '1h';
const REFRESH_TOKEN_EXPIRY_TIME = '7d';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY_TIME });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY_TIME });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, generateRefreshToken, verifyToken };
