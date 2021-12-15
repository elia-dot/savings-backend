require('dotenv').config();
const express = require('express');
const { Expo } = require('expo-server-sdk');
const cors = require('cors');
const app = express();

const connectDb = require('./utils/conectDb');

const userRouter = require('./routes/userRoutes');
const goalRouter = require('./routes/goalRoutes');
const savingRouter = require('./routes/savingRoutes');
const tasksRouter = require('./routes/tasksRoutes');
const PushToken = require('./models/PushToken');
const Parent = require('./models/Parent');
const Child = require('./models/Child');

app.use(express.json());
app.use(cors());
app.options('*', cors());

connectDb();

app.use('/users', userRouter);
app.use('/goals', goalRouter);
app.use('/savings', savingRouter);
app.use('/tasks', tasksRouter);

let expo = new Expo();

const handlePushTokens = async (push, req, res) => {
  const { title, body, to } = push;
  let notifications = [];

  let user;

  user = await Parent.findById(to);
  if (!user) user = await Child.findById(to);

  const pushToken = user.pushToken;

  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    return res.status(404).json({
      status: 'fail',
      error: `Push token ${pushToken} is not a valid Expo push token`,
    });
  }

  notifications.push({
    to: pushToken,
    sound: 'default',
    title: title,
    body: body,
    data: { body },
  });

  let chunks = expo.chunkPushNotifications(notifications);
  let tickets = [];
  (async () => {
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
  })();

  return res.status(200).json({ status: 'success' });
};

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
  saveToken(req.body.token.value, req, res);
  console.log(`Received push token, ${req.body.token.value.data}`);
});

app.post('/message', (req, res) => {
  handlePushTokens(req.body, req, res);
  console.log(`Received message, with title: ${req.body.title}`);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${3000}`);
});
