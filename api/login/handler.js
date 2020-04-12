"use strict";

const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

AWS.config.update({
  region: process.env.AWS_REGION
});
const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.store = async event => {
  try {
    const body = JSON.parse(event.body);

    const responseQuery = await documentClient
      .query({
        TableName: process.env.DYNAMODB_USERS,
        IndexName: process.env.DYNAMODB_USERS_INDEX_EMAIL,
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": body.email
        }
      })
      .promise();

    const user = responseQuery.Items[0];
    if (!user) {
      return {
        statusCode: 422,
        body: JSON.stringify({
          status: false,
          message: "Email and/or password does not match"
        })
      };
    }

    const { id, email, password, role } = user;
    const isMatch = bcrypt.compareSync(body.password, password);
    if (!isMatch) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          status: false,
          message: "Email and/or password does not match"
        })
      };
    }

    const token = jwt.sign(
      {
        id,
        email,
        role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: {
          token
        },
        status: true,
        message: "Success! You've been logged"
      })
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: false,
        message: "Unable to process login"
      })
    };
  }
};
