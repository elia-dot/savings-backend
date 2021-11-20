const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const Child = require('../models/Child');
const { auth } = require('../utils/auth');

const {
  getOneById,
  updateOne,
  deleteOne,
  createOne,
  getAll,
  getAllByUser,
} = require('../utils/handlersFactory');

//create goal

router.post('/:id', auth, async (req, res) => {
  try {
    const saving = await Goal.create({ ...req.body, user: req.params.id });
    const childDoc = await Child.findById(req.params.id);
    const updatedGoals = [saving._id, ...childDoc.goals];
    childDoc.goals = updatedGoals
    await childDoc.save()

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


router.get('/', auth, getAll(Goal));
router.get('/:id', auth, getOneById(Goal));
router.get('/users/:userId', auth, getAllByUser(Goal));
router.patch('/:id', auth, updateOne(Goal));
router.delete('/:id', auth, deleteOne(Goal));

module.exports = router;
