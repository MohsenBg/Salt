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

  if (hasPassword.hash === userData[0].password.hash) {
    res
      .status(202)
      .cookie(
        "userLogin",
        {
          userName,
          name: userData[0].name,
          email: userData[0].emailInfo.email,
          Status: userData[0].emailInfo.Active,
        },
        {
          path: "/",
          httpOnly: true,
          sameSite: true,
          //  secure: true,
          maxAge: 1 * 60 * 1000,
        }
      )
      .send({
        success: true,
        MongoError: false,
        userInfo: {
          userName: userData[0].userName,
          name: userData[0].name,
          email: userData[0].emailInfo.email,
          Status: userData[0].emailInfo.Active,
        },
      });
  } else {
    return res.send({
      success: false,
      MongoError: false,
    });
  }
});

module.exports = router;
