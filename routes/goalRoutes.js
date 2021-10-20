const express = require('express') 
const router = express.Router();
const Goal = require('../models/Goal');
const { auth } = require('../utils/auth');

const { getOneById, updateOne, deleteOne, createOne, getAll, getAllByUser } = require('../utils/handlersFactory');

router.post('/', auth, createOne(Goal))
router.get('/', auth, getAll(Goal))
router.get('/:id', auth, getOneById(Goal));
router.get('/users/:userId', auth, getAllByUser(Goal));
router.patch('/:id', auth, updateOne(Goal))
router.delete('/:id', auth, deleteOne(Goal))



module.exports = router;