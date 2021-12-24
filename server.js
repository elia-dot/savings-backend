require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const connectDb = require('./utils/conectDb');

const userRouter = require('./routes/userRoutes');
const goalRouter = require('./routes/goalRoutes');
const savingRouter = require('./routes/savingRoutes');
const tasksRouter = require('./routes/tasksRoutes');
const PushToken = require('./models/PushToken');
const { handlePushTokens } = require('./utils/sentNotification');
const Child = require('./models/Child')

app.use(express.json());
app.use(cors());
app.options('*', cors());

connectDb();

app.use('/users', userRouter);
app.use('/goals', goalRouter);
app.use('/savings', savingRouter);
app.use('/tasks', tasksRouter);

const saveToken = async (token, req, res) => {
  const exists = await PushToken.findOne({ token: token.data });
  if (!exists) {
    await PushToken.create({ token: token.data });
    res.status(201).json({
      status: 'success',
      data: token,
    });
  }
};

app.post('/token', (req, res) => {
  saveToken(req.body.token, req, res);
  console.log(`Received push token, ${req.body.token}`);
});

app.post('/message', (req, res) => {
  handlePushTokens(req.body.message, req, res);
  console.log(`Received message, with title: ${req.body.message.title}`);
});

app.post('/message/reminder', (req, res) => {
  handlePushTokens(req.body, req, res);
  console.log(req.body);
  console.log(`Received message, with title: ${req.body.title}`);
});

app.post('/message/task-completed', (req, res) => {
  handlePushTokens(req.body, req, res);
  console.log(req.body);
  console.log(`Received message, with title: ${req.body.title}`);
});

app.patch('/add-profit', async (req, res) => {
  try {
    const childs = await Child.find({ revenue: { $gt: 0 } });

    childs.forEach((child) => {
      const total = child.saving + child.profit;
      const profit = total * (child.revenue / 100);
      child.profit += profit;
      child.save();

      const createSaving = async () => {
        await Saving.create({
          user: child._id,
          amount: profit,
          description: 'monthly yield',
        });
      };
      createSaving();
    });
    return res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      error,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${3000}`);
});
