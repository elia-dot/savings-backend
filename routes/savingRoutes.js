const express = require('express');
const Child = require('../models/Child');
const router = express.Router();
const Saving = require('../models/Saving');
const { auth } = require('../utils/auth');

const {
  getOneById,
  updateOne,
  deleteOne,
  createOne,
  getAll,
  getAllByUser,
} = require('../utils/handlersFactory');

router.get('/', auth, getAll(Saving));
router.get('/:id', auth, getOneById(Saving));
router.get('/users/:userId', auth, getAllByUser(Saving));
router.patch('/:id', auth, updateOne(Saving));
router.delete('/:id', auth, deleteOne(Saving));

//create saving
router.post('/:id', auth, async (req, res) => {
  try {
    const saving = await Saving.create({ ...req.body, user: req.params.id });
    return res.status(201).json({
      status: 'success',
      data: {
        data: saving,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      error: 'Server Error',
    });
  }
});

module.exports = router;
