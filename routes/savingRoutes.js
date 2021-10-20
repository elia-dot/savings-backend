const express = require('express') 
const router = express.Router();
const Saving = require('../models/Saving');
const { auth } = require('../utils/auth');

const { getOneById, updateOne, deleteOne, createOne, getAll, getAllByUser } = require('../utils/handlersFactory');

router.post('/', auth, createOne(Saving))
router.get('/', auth, getAll(Saving))
router.get('/:id', auth, getOneById(Saving));
router.get('/users/:userId', auth, getAllByUser(Saving));
router.patch('/:id', auth, updateOne(Saving))
router.delete('/:id', auth, deleteOne(Saving))



module.exports = router;