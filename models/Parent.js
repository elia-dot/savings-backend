const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter a valid email'],
    unique: true,
    validate: {
      validator: function validateEmail(emailAdress) {
        let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (emailAdress.match(regexEmail)) {
          return true;
        } else {
          return false;
        }
      },
      message: 'Please enter a valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Child',
    },
  ],
});

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'children',
  });
  next();
});

module.exports = Parent = mongoose.model('Parent', parentSchema);
