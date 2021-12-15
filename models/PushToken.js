const mongoose = require('mongoose');

const pushTokenSchema = new mongoose.Schema({
  token: {
    type: String,
  },
});

module.exports = PushToken = mongoose.model('PushToken', pushTokenSchema);
