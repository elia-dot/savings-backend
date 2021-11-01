const mongoose = require('mongoose');
const User = require('./User')

const savingSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

savingSchema.post('save', async function() {
  const user = await User.findById(this.user)
  user.saving += this.amount

  await user.save()
})

savingSchema.pre(/^deleteOne/, async function() {
  const user = await User.findById(this.user)
  user.saving -= this.amount

  await user.save()
})

module.exports = Saving = mongoose.model('Saving', savingSchema);
