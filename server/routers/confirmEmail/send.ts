import { Model } from "mongoose";
import { Router } from "express";
const express = require("express");
const router: Router = express.Router();
const userModel: typeof Model = require("../../model/userModel");
const { MakeCode } = require("../../Functions/PasswordsFunction");
const { FRONT_URL } = require("../../url");
const { sendConfirmEmail } = require("../../Functions/NodeMailer");

//!confirmEmail/send
router.post("/confirmEmail/send", async (req, res) => {
  const userName = req.body.userName;
  const email = req.body.email;

  const userInfo = await userModel.find({ userName });

  if (userInfo.length === 0)
    res.send({ success: false, cause: "user Not Exits" });
  const { hash, code } = MakeCode();
  console.log(userInfo);

  await userModel.findByIdAndUpdate(userInfo[0]._id, {
    "emailInfo.email": `${email}`,
    "emailInfo.code": `${hash}`,
  });
  await sendConfirmEmail(
    email,
    `${FRONT_URL}/confirmEmail/${userName}/${code}`,
    userInfo[0].name
  );
  res.send({ success: true });
});

module.exports = router;
