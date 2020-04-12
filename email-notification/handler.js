"use strict";

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: 2525,
  secure: false,
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_FROM_PASSWORD,
  },
});

module.exports.send = async (event) => {
  const emailPromises = [];
  for (const record of event.Records) {
    const text = JSON.parse(record.body).Message;

    const mail = transporter.sendMail({
      from: `"Reservas" <noreply.serverless@teste.com>`,
      to: process.env.EMAIL_TO,
      subject: "Reserva efetuada",
      text,
      html: text,
    });
    emailPromises.push(mail);
  }

  await Promise.all(emailPromises);
  return { message: "200" };
};
