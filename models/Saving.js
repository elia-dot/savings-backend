const mongoose = require('mongoose');
const Child = require('./Child');

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
    ref: 'Child',
  },
  type: {
    type: String,
    default: 'saving',
  },
  description : {
    type : String
  }
});

savingSchema.post('save', async function () {
  const user = await Child.findById(this.user);
  user.saving += this.amount;
  if (this.type === 'profit') user.profit += this.amount;
  await user.save();
});

module.exports = Saving = mongoose.model('Saving', savingSchema);
