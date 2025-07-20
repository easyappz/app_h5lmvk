const { verifyToken } = require('../utils/jwt');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  const decoded = verifyToken(token.split(' ')[1]);

  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  req.userId = decoded.id;
  next();
};

module.exports = authMiddleware;