"use strict";

const messagebird = require("messagebird")(process.env.MESSAGE_BIRD_API_KEY);
// const util = require("util");

// implementar uma function para ser promise
// util.promisify(messagebird.messages.create);

module.exports.send = async (event) => {
  const smsPromises = [];

  for (const record of event.Records) {
    const message = JSON.parse(record.body).Message;

    smsPromises.push(sendMessageBird(message));
  }

  await Promise.all(smsPromises);

  return {
    message: "Go Serverless v1.0! Your function executed successfully!",
    event,
  };
};

const sendMessageBird = (message) => {
  return new Promise((resp, rej) => {
    messagebird.messages.create(
      {
        originator: process.env.MESSAGE_BIRD_SMS_PHONE_FROM,
        recipients: [process.env.MESSAGE_BIRD_SMS_PHONE_TO],
        body: message,
      },
      (error, callback) => {
        if (!error) {
          console.log(JSON.stringify(callback));
          return resp({});
        }

        return rej(error);
      }
    );
  });
};
