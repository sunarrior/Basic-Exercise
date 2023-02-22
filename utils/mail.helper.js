import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const config = {
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWD,
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

async function sendVerifyMail(username, email, token) {
  try {
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

async function sendRecoveryCode(username, email, code) {
  try {
    const timeSended = new Date();
    const mailData = {
      to: email,
      subject: `Recovery code ${timeSended.toLocaleTimeString()}`,
      htmlContent: `<b>
        Recovery code for account ${username}: ${code}
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
  sendRecoveryCode,
};
