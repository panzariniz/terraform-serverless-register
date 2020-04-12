"use strict";

const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

AWS.config.update({
  region: process.env.AWS_REGION
});
const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.store = async event => {
  const body = JSON.parse(event.body);
  const { name, email, password, role = "user" } = body;

  await documentClient
    .put({
      TableName: process.env.DYNAMODB_USERS,
      Item: {
        id: uuidv4(),
        name: name,
        email: email,
        password: bcrypt.hashSync(password, 10),
        role
      }
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify({ message: "Success! User created." })
  };
};
