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
  type: {
    type: String,
    default: 'child',
  },
  profit: {
    type: Number,
    default: 0,
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
  ],
});

childSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'goals',
  }).populate({
    path: 'tasks',
    select: { 'completed': 1 },
  });

  next();
});

module.exports = Child = mongoose.model('Child', childSchema);
