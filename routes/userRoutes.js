const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { createSendToken } = require('../utils/token');

const { getOneById, updateOne, deleteOne } = require('../utils/handlersFactory');

//signup

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    createSendToken(newUser, req, res);
  } catch (error) {
    console.log(error.errors);
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'fail',
        errors: 'User already exist with this email!',
      });
    } else if (error._message.includes('validation')) {
      return res.status(400).json({
        status: 'fail',
        errors: Object.keys(error.errors).map(
          (key) => (error.errors[key] = error.errors[key].message)
        ),
      });
    } else {
      return res.status(500).json({
        status: 'fail',
        error: 'Server Error',
      });
    }
  }
});

//login

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        error: 'User do not exist!',
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: 'fail',
        error: 'Invalid email or password!',
      });
    }
    createSendToken(user, req, res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      error: 'Server Error',
    });
  }
});


router.get('/:id', getOneById(User));
router.patch('/:id', updateOne(User))
router.delete('/:id', deleteOne(User))



module.exports = router;
