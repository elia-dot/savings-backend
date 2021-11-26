const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const Parent = require('../models/Parent');
const { createSendToken } = require('../utils/token');
const { auth } = require('../utils/auth');
const {
  getOneById,
  updateOne,
  deleteOne,
} = require('../utils/handlersFactory');
const Child = require('../models/Child');

//signup

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await Parent.create({
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
        )[0],
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
    const { email, username, password } = req.body;
    let user;

    if (email) {
      user = await Parent.findOne({ email });
      if (!user) {
        return res.status(404).json({
          status: 'fail',
          error: 'User do not exist!',
        });
      }
    } else if (username) {
      user = await Child.findOne({ username });
      if (!user) {
        return res.status(404).json({
          status: 'fail',
          error: 'User do not exist!',
        });
      }
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

//add Child

router.post('/add-child', auth, async (req, res) => {
  const parent = req.user._id;
  const { username, name, password, revenue } = req.body;
  if (req.user.type !== 'parent')
    return res.status(400).json({
      status: 'fail',
      error: 'Unauthorized',
    });
  const parentDoc = await Parent.findById(parent);
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newChild = await Child.create({
      name,
      username,
      password: hashedPassword,
      revenue,
      parent,
    });

    const updatedChildren = { children: [...parentDoc.children, newChild._id] };
    await Parent.findByIdAndUpdate(parent, updatedChildren);

    res.status(201).json({
      status: 'success',
      data: {
        newChild,
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

//parent

router.get('/:id', getOneById(Parent));
router.patch('/:id', updateOne(Parent));
router.delete('/:id', deleteOne(Parent));

//child

router.get('/child/:id', getOneById(Child));
router.patch('/child/:id', updateOne(Child));
router.delete('/child/:id', deleteOne(Child));

module.exports = router;
