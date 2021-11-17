const mongoose = require('mongoose');
const User = require('./User');

const profitSchema = new mongoose.Schema({
  amount: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
});

profitSchema.post('save', async function () {
  const user = await User.findById(this.user);
  user.revenue += this.amount;
  await user.save();
});

module.exports = Profit = mongoose.model('Profit', profitSchema);
