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

const sendConfirmEmail = async (email: string, Link: string, name: string) => {
  await transport
    .sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Please confirm your account",
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>confirm Password</title>
      
      <style>
          @import url("https://fonts.googleapis.com/css2?family=Cookie&family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap");
      
      </style>
      </head>
      <body
      style="padding: 10px;
      width:"350px";
      margin: 0;
      "
      
      >
          <div
          style="font-family: sans-serif;
          font-weight: 600;
          font-size: 2.5em;
         color: rgb(210,67,56);
         font-family: Cookie, cursive;
         padding-left: 30px;">
              Salt
          </div>
         <hr 
         style="opacity: 0.5;"
         />
         <div style="text-align: center;
         padding: 50px;
         ">
             <h2>Hi ${name}, </h2>
             <div
             style="font-size: 18px;
             font-weight: 500;"
             >
             <div>
             Thanks so much for joining Salt! To finish singing up, you just
             </div>
             <div>
             need to confirm that we got your email right.
             </div> 
             </div>
             <a href="${Link}">
             <button
             style="background-color:rgb(210,67,56) ; color: white;
             padding: 8px 18px;
             margin-top:2em;
             border: none;
             cursor: pointer;
             border-radius: 2px;
             font-size: 15px;
             box-shadow: 0 0 2px 1px  gray;
             "
             >
             Confirm your Email
             </button>
             </a>
      </div>
      </body>
      </html>`,
    })
    .catch((err: any) => console.log(err));
};
const SendForgetPassword = async (
  email: string,
  Link: string,
  name: string
) => {
  await transport
    .sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Request for change Password",
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>confirm Password</title>
      
      <style>
          @import url("https://fonts.googleapis.com/css2?family=Cookie&family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap");
      
      </style>
      </head>
      <body
      style="padding: 10px;
      width:"350px";
      margin: 0;
      "
      
      >
          <div
          style="font-family: sans-serif;
          font-weight: 600;
          font-size: 2.5em;
         color: rgb(210,67,56);
         font-family: Cookie, cursive;
         padding-left: 30px;">
              Salt
          </div>
         <hr 
         style="opacity: 0.5;"
         />
         <div style="text-align: center;
         padding: 50px;
         ">
             <h2>Hi ${name}, </h2>
             <div
             style="font-size: 18px;
             font-weight: 500;"
             >
             <div>
             Thanks so much for joining Salt! To finish singing up, you just
             </div>
             <div>
             need to confirm that we got your email right.
             </div> 
             </div>
             <a href="${Link}">
             <button
             style="background-color:rgb(210,67,56) ; color: white;
             padding: 8px 18px;
             margin-top:2em;
             border: none;
             cursor: pointer;
             border-radius: 2px;
             font-size: 15px;
             box-shadow: 0 0 2px 1px  gray;
             "
             >
             Confirm your Email
             </button>
             </a>
      </div>
      </body>
      </html>`,
    })
    .catch((err: any) => console.log(err));
};

module.exports = { sendConfirmEmail };
