const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
  image: {
    type: String,
  },
  saving: {
    type: Number,
    default: 0,
  },
  goals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goal',
    },
  ],
  preferences: {
    currency: {
      type: String,
      default: 'NIS',
    },
    notification: {
      type: String,
      default: 'never',
    },
  },
});

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'goals',
  });

  next();
});

module.exports = User = mongoose.model('User', userSchema);
