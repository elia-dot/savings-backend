const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { promisify } = require('util');

module.exports.auth = async (req, res, next) => {
  let token;
  if (req.headers.cookie) {
    token = req.headers.cookie.split('=')[1];
  }
  if (!token) {
    return res.status(403).json({ message: 'Unauthorized! Please login' });
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(403).json({ message: 'Unauthorized!' });
  }

  req.user = user;
  next();
};
