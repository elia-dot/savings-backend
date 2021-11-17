const mongoose = require('mongoose');
const Child = require('./Child');

const goalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter a title'],
  },
  price: {
    type: Number,
    required: [true, 'Please enter a price'],
  },
  icon : {
    type: String
  },
  createdAt : {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
  },
});

goalSchema.post('save', async function () {
  const user = await Child.findById(this.user);
  user.goals = [...user.goals, this._id];

  await user.save();
});


module.exports = Goal = mongoose.model('Goal', goalSchema);
