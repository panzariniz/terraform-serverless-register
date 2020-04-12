"use strict";

const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

AWS.config.update({
  region: process.env.AWS_REGION
});
const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.store = async event => {
  const body = JSON.parse(event.body);
  const createdUpdatedAt = new Date().toISOString();

  await documentClient
    .put({
      TableName: process.env.DYNAMODB_BOOKINGS,
      Item: {
        id: uuidv4(),
        user_id: event.requestContext.authorizer.id,
        date: body.date,
        canceled: 0,
        created_at: createdUpdatedAt,
        updated_at: createdUpdatedAt
      }
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Success! Booking created"
    })
  };
};
