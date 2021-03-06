const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const Child = require('../models/Child');
const Parent = require('../models/Parent');

module.exports.auth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.headers.cookie) {
    token = req.headers.cookie.split('=')[1];
  }
  if (!token) {
    return res.status(403).json({ message: 'Unauthorized! Please login' });
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  let user = await Parent.findById(decoded.id);
  if (!user) {
    user = await Child.findById(decoded.id);
    if (!user) {
      return res.status(403).json({ message: 'Unauthorized!' });
    }
  }

  req.user = user;
  next();
};
