const express = require('express');
const Child = require('../models/Child');
const router = express.Router();
const Saving = require('../models/Saving');
const { auth } = require('../utils/auth');

const {
  getOneById,
  updateOne,
  deleteOne,
  getAll,
  getAllByUser,
  createSaving,
} = require('../utils/handlersFactory');

router.get('/', auth, getAll(Saving));
router.get('/:id', auth, getOneById(Saving));
router.get('/users/:userId', auth, getAllByUser(Saving));
router.patch('/:id', auth, updateOne(Saving));
router.delete('/:id', auth, deleteOne(Saving));

//create saving
router.post('/:id', auth, createSaving);

module.exports = router;
