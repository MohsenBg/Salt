import { Model } from "mongoose";
const express = require("express");
import { Router } from "express";
const { MakeCode } = require("../../Functions/PasswordsFunction");
const { sendForgetPassword } = require("../../Functions/NodeMailer");
const router: Router = express.Router();
const { FRONT_URL } = require("../../url");
const userModule: typeof Model = require("../../modules/userModules");
router.post("/forgetPassword", async (req, res) => {
  const username = req.body.userName;
  const email = req.body.email;

  const userInfo = await userModule
    .find(
      typeof email !== "undefined"
        ? { "emailInfo.email": `${email}` }
        : { userName: username }
    )
    .select(["userName", "name", "emailInfo"]);

  if (userInfo.length > 0) {
    const { code, hash } = MakeCode();
    const { _id, name, emailInfo, userName } = userInfo[0];
    await userModule.findByIdAndUpdate(_id, {
      changePasswordCode: hash,
    });

    await sendForgetPassword(
      emailInfo.email,
      `${FRONT_URL}/forgetPassword/${userName}/${code}`,
      name
    );
    res.send({
      userName: userName,
      name: name,
      email: emailInfo.email,
      Status: emailInfo.Active,
    });
  } else {
    res.send("user Not Exist");
  }
});
module.exports = router;
