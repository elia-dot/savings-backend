const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: [true, 'Please enter a name'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent',
  },
  createdAt: {
    type: Date,
    expires: '15m',
    default: Date.now,
  },
});

module.exports = Token = mongoose.model('Token', tokenSchema);
