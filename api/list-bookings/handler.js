"use strict";

const AWS = require("aws-sdk");
AWS.config.update({
  region: process.env.AWS_REGION
});

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.index = async event => {
  if (event.requestContext.authorizer.role !== "admin") {
    return {
      statusCode: 403
    };
  }

  const responseQuery = await documentClient
    .scan({
      TableName: process.env.DYNAMODB_BOOKINGS
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      result: responseQuery.Items
    })
  };
};
