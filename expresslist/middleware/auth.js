
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET, ACCESS_COOKIE_NAME } = require('../config/auth');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader && authHeader.split(' ')[1];
  const cookieToken = req.cookies && req.cookies[ACCESS_COOKIE_NAME];
  const token = bearerToken || cookieToken;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
};

