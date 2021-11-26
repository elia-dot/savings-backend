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
  if (!child.tasks.includes(this._id)) {
    child.tasks.push(this._id);
  }
  await child.save();
});

module.exports = Task = mongoose.model('Task', taskSchema);
