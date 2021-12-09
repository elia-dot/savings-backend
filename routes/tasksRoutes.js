const express = require('express');
const router = express.Router();

const Task = require('../models/Task');
const { auth } = require('../utils/auth');
const {
  getOneById,
  updateOne,
  deleteOne,
  getAll,
  createSaving,
} = require('../utils/handlersFactory');

//create task

router.post('/:id', auth, async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, assignTo: req.params.id });

    return res.status(201).json({
      status: 'success',
      data: task,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      error: 'Server Error',
    });
  }
});

//get all child's tasks

router.get('/users/:userId', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ assignTo: req.params.userId }).sort({
      createdAt: -1,
    });
    return res.status(201).json({
      status: 'success',
      data: tasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      error: 'Server Error',
    });
  }
});

//mark task as complete

router.post('/:id/:taskId', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    task.completed === true
      ? (task.completed = false)
      : (task.completed = true);
    await task.save();
    createSaving(req, res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      error: 'Server Error',
    });
  }
});

router.get('/', auth, getAll(Task));
router.get('/:id', auth, getOneById(Task));
router.patch('/:id', auth, updateOne(Task));
router.delete('/:id', auth, deleteOne(Task));

module.exports = router;
