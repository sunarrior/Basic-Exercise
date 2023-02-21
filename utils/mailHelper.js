import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

import encrypt from "./encrypt.js";
import redisHelper from "./redisHelper.js";

const config = {
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

async function sendMailFromGmail(mailData) {
  try {
    const message = {
      from: process.env.GMAIL_USER,
      to: mailData.to,
      subject: mailData.subject,
      html: mailData.htmlContent,
    };
    await transporter.sendMail(message);
  } catch (err) {
    console.log(err);
  }
}

async function sendVerifyMail(username, email) {
  try {
    const token = await encrypt.generateToken(64);
    await redisHelper.setCache(username, { token: token }, 120);
    const timeSended = new Date();
    const mailData = {
      to: email,
      subject: `Verify account ${timeSended.toLocaleTimeString()}`,
      htmlContent: `<b>
        Click <a href="http://localhost:3000/api/v1/auth/verify/${username}/${token}">here</a> 
        to verify your account
      </b>`,
    };
    await sendMailFromGmail(mailData);
  } catch (err) {
    console.log(err);
  }
}

export default {
  sendMailFromGmail,
  sendVerifyMail,
};
