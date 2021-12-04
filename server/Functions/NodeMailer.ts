const nodemailer = require("nodemailer");
require("dotenv").config();

const transport: any = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendConfirmEmail = async (email: string, Link: any) => {
  await transport
    .sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
        <h2>Hello</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=${Link}> Click here</a>
        </div>`,
    })
    .catch((err: any) => console.log(err));
};

module.exports = { sendConfirmEmail };
