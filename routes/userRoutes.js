const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const Parent = require('../models/Parent');
const { createSendToken } = require('../utils/token');
const { auth } = require('../utils/auth');
const {
  getOneById,
  updateOne,
  deleteOne,
} = require('../utils/handlersFactory');
const Child = require('../models/Child');
const Token = require('../models/Token');

const transport = nodemailer.createTransport({
  host: 'mail.privateemail.com',
  port: 465,
  auth: {
    user: 'savingoals@savingoals.com',
    pass: process.env.EMAIL_PASSWORD,
  },
});

//signup

router.post('/signup', async (req, res) => {
  try {
    const { email, password, pushToken } = req.body;

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await Parent.create({
      email,
      password: hashedPassword,
      pushToken,
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
    const { email, username, password, pushToken } = req.body;
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
    user.pushToken = pushToken;
    await user.save();
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
  const isMatch = await bcrypt.compare(password, parentDoc.password);
  if (isMatch) {
    return res.status(400).json({
      status: 'fail',
      error: 'Child password must be different from the parent password',
    });
  }
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
    if (error.code === 11000)
      return res.status(500).json({
        status: 'fail',
        error: 'this username already exsits',
      });
    return res.status(500).json({
      status: 'fail',
      error: 'Server Error',
    });
  }
});

//update child password
router.post('/update-password/child/:id', auth, async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);
    if (!child) {
      return res.status(404).json({
        status: 'fail',
        error: `doc not exist`,
      });
    }
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    child.password = hashedPassword;
    await child.save();
    res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      error: 'Server Error',
    });
  }
});

//create reset password token

router.post('/forgot-password', async (req, res) => {
  try {
    const user = await Parent.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        ststus: 'fail',
        error: 'User not found',
      });
    }

    let token = await Token.findOne({ user: user._id });
    if (token) await token.deleteOne();
    const newToken = Math.floor(100000 + Math.random() * 900000);
    token = await Token.create({ token: newToken, user: user._id });

    const message = {
      from: 'savingoals@savingoals.com',
      to: user.email,
      subject: 'password verification code',
      text: `???????? ?????? ???????????? ???????????? ??????: ${newToken.toString()}`,
    };
    transport.sendMail(message, function (err, info) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          ststus: 'fail',
          error: err,
        });
      } else {
        return res.status(201).json({
          status: 'success',
          data: token,
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      error: 'Server Error',
    });
  }
});

//verify token

router.post('/reset-password', async (req, res) => {
  try {
    const token = await Token.findOne({ token: req.body.token });
    if (!token) {
      return res.status(404).json({
        status: 'fail',
        error: 'Token not found',
      });
    }
    const user = await Parent.findById(token.user);
    return res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      error: 'Server Error',
    });
  }
});

//reset password

router.post('/update-password/parent/:id', auth, async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id);
    if (!parent) {
      return res.status(404).json({
        status: 'fail',
        error: `user not exist`,
      });
    }
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    parent.password = hashedPassword;
    await parent.save();
    res.status(200).json({
      status: 'success',
      data: parent,
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
