const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, secret);
    req.user = {
      userId: decoded.userId,
      id: decoded.userId // For backward compatibility
    };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}; 