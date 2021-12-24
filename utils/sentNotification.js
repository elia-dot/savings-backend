const { Expo } = require('expo-server-sdk');

const Parent = require('../models/Parent');
const Child = require('../models/Child');

let expo = new Expo();

module.exports.handlePushTokens = async (push, req, res) => {
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

  let receiptIds = [];
  for (let ticket of tickets) {
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  }

  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  (async () => {
    for (let chunk of receiptIdChunks) {
      try {
        let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
        console.log(receipts);

        for (let receiptId in receipts) {
          let { status, message, details } = receipts[receiptId];
          if (status === 'ok') {
            continue;
          } else if (status === 'error') {
            console.error(
              `There was an error sending a notification: ${message}`
            );
            if (details && details.error) {
              console.error(`The error code is ${details.error}`);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  })();
  return res.status(200).json({ status: 'success' });
};
