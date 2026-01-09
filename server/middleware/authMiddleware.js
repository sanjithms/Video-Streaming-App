const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // 1. Check Authorization Header (Standard API)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // 2. Check Query Param (For Video Streaming URL)
  else if (req.query.token) {
    token = req.query.token;
  }

  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretKey123');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };