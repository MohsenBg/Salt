import { Router } from "express";
import { Model } from "mongoose";
const express = require("express");
const router: Router = express.Router();
const userModel: typeof Model = require("../model/userModel");
const {
  MakeSalt,
  MakeCode,
  convertPasswordToHash,
} = require("../Functions/PasswordsFunction");
const { sendConfirmEmail } = require("../Functions/NodeMailer");
const { FRONT_URL } = require("../url");
//! /signup
router.post("/signup", async (req, res) => {
  const userName = req.body.userName;
  const name = req.body.name;
  const password = req.body.password;
  const email = req.body.email;

  const userNameExist =
    (await userModel.find({ userName })).length > 0 ? true : false;
  const userEmailExist =
    (await userModel.find({ "emailInfo.email": email })).length > 0
      ? true
      : false;

  if (userNameExist || userEmailExist)
    return res.send({
      success: false,
      uniqueUserName: userNameExist ? false : true,
      uniqueUserEmail: userEmailExist ? false : true,
      MongoError: false,
    });

  const salt = MakeSalt();
  const { hash, code } = MakeCode();

  const hasPassword = convertPasswordToHash(password, salt);

  const MakeNewUser = new userModel({
    userName,
    name,
    password: hasPassword,
    emailInfo: {
      code: hash,
      email,
      Active: false,
    },
    changePassword: "",
  });
  await MakeNewUser.save();
  await sendConfirmEmail(
    email,
    `${FRONT_URL}/confirmEmail/${userName}/${code}`,
    name
  );
  res.send({
    success: true,
    uniqueUserName: true,
    MongoError: false,
  });
});

module.exports = router;
