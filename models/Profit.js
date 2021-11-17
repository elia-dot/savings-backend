const mongoose = require('mongoose');
const Child = require('./Child');

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
    ref: 'Child',
  },
});

profitSchema.post('save', async function () {
  const user = await Child.findById(this.user);
  user.revenue += this.amount;
  await user.save();
});

module.exports = Profit = mongoose.model('Profit', profitSchema);
