const mongoose = require('mongoose');

const Child = require('./Child');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task must have a title'],
  },
  assignTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: [true, 'task must be asign to a child'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    required: [true, 'task must have a price'],
  },
});

taskSchema.post('save', async function () {
  const child = await Child.findById(this.assignTo);
  if (child.tasks.find(this._id) === -1) {
    child.tasks.push(this._id);
  }
  await user.save();
});

module.exports = Task = mongoose.model('Task', taskSchema);
