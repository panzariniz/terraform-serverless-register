"use strict";

const AWS = require("aws-sdk");
const ptBR = require("date-fns/locale/pt-BR");
const format = require("date-fns/format");

AWS.config.update({
  region: process.env.AWS_REGION
});

const sns = new AWS.SNS();
const documentClient = new AWS.DynamoDB.DocumentClient();
const converter = AWS.DynamoDB.Converter;

module.exports.listen = async event => {
  const snsPromises = [];

  for (const record of event.Records) {
    if (record.eventName === "INSERT") {
      const booking = converter.unmarshall(record.dynamodb.NewImage);
      const user = await documentClient
        .get({
          Key: {
            id: booking.user_id
          },
          TableName: process.env.DYNAMODB_USERS
        })
        .promise();

      const dateFormat = format(
        new Date(booking.date * 1000),
        "EEEE',' dd 'de' MMMM 'de' yyyy 'às' HH:mm",
        {
          locale: ptBR
        }
      );

      snsPromises.push(
        sns
          .publish({
            TopicArn: process.env.SNS_NOTIFICATIONS_TOPIC,
            Message: `Reserva efetuada: O usuario ${user.Item.name} (${user.Item.email}) agendou um horário: ${dateFormat}`
          })
          .promise()
      );
    }
  }

  await Promise.all(snsPromises);
  console.log("Mensagem(ns) enviada(s) com sucesso!");

  return {
    message: "Go Serverless v1.0! Your function executed successfully!"
  };
};
