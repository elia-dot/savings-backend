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

app.use(express.json());
app.use(cors());
app.options('*', cors());

connectDb();

app.use('/users', userRouter);
app.use('/goals', goalRouter);
app.use('/savings', savingRouter);
app.use('/tasks', tasksRouter);

// const handlePushTokens = ({ title, body }) => {
//   let notifications = [];
//   for (let pushToken of savedPushTokens) {
//     if (!Expo.isExpoPushToken(pushToken)) {
//       console.error(`Push token ${pushToken} is not a valid Expo push token`);
//       continue;
//     }

//     notifications.push({
//       to: pushToken,
//       sound: 'default',
//       title: title,
//       body: body,
//       data: { body },
//     });
//   }

//   let chunks = expo.chunkPushNotifications(notifications);

//   (async () => {
//     for (let chunk of chunks) {
//       try {
//         let receipts = await expo.sendPushNotificationsAsync(chunk);
//         console.log(receipts);
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   })();
// };

const saveToken = (token) => {
  console.log(token);
  const exists = PushToken.findOne({ token });
  if (!exists) {
    PushToken.create({ token });
  }
};

app.post('/token', (req, res) => {
  saveToken(req.body.token.value);
  console.log(`Received push token, ${req.body.token.value}`);
  res.send(`Received push token, ${req.body.token.value}`);
});

// app.post('/message', (req, res) => {
//   handlePushTokens(req.body);
//   console.log(`Received message, with title: ${req.body.title}`);
//   res.send(`Received message, with title: ${req.body.title}`);
// });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${3000}`);
});
