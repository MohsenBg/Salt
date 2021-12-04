import { Router } from "express";
import { Model } from "mongoose";
const express = require("express");
const router: Router = express.Router();
const usersModel: typeof Model = require("../modules/userModules");
const { convertPasswordToHash } = require("../Functions/PasswordsFunction");
//! /login
router.post("/login", async (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;
  const userData: any = await usersModel.find({ userName });
  if (userData.length === 0) {
    return res.send({
      success: false,
      MongoError: false,
    });
  }
  const hasPassword = convertPasswordToHash(
    password,
    userData[0].password.salt
  );

  console.log("converted: " + hasPassword.hash);
  console.log("server: " + userData[0].password.hash);

  if (hasPassword.hash === userData[0].password.hash) {
    res.send({
      success: true,
      MongoError: false,
    });
  } else {
    return res.send({
      success: false,
      MongoError: false,
    });
  }
});

module.exports = router;
