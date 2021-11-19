const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name'],
  },
  username: {
    type: String,
    required: [true, 'Please enter a name'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
  },
  saving: {
    type: Number,
    default: 0,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent',
  },
  goals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goal',
    },
  ],
  revenue: {
    type: Number,
    default: 0,
  },
  type : {
    type: String,
    default: 'child'
  }
});

childSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'goals',
  });

  next();
});

module.exports = Child = mongoose.model('Child', childSchema);
