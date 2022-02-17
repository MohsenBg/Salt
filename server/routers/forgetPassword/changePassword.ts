import { Model } from "mongoose";
const express = require("express");
import { Router } from "express";
const router: Router = express.Router();
const {
  MakeSalt,
  convertPasswordToHash,
} = require("../../Functions/PasswordsFunction");
const userModel: typeof Model = require("../../model/userModel");
const sha256 = require("sha256");

router.post("/forgetPassword/changePassword", async (req, res) => {
  const userName = req.body.userName;
  const code = req.body.code;
  const newPassword = req.body.password;
  const userInfo = await userModel
    .find({ userName })
    .select(["userName", "name", "emailInfo", "changePasswordCode"]);

  if (userInfo.length > 0) {
    if (userInfo[0].changePasswordCode !== "") {
      if (sha256(code) == userInfo[0].changePasswordCode) {
        const { _id, name, emailInfo, userName } = userInfo[0];
        const salt = MakeSalt();
        const { hash } = convertPasswordToHash(newPassword, salt);
        await userModel.findByIdAndUpdate(_id, {
          changePasswordCode: "",
          "password.salt": `${salt}`,
          "password.hash": `${hash}`,
        });

        res.send({
          success: true,
          userName: userName,
          name: name,
          email: emailInfo.email,
          Status: emailInfo.Active,
        });
      } else {
        res.send({ success: false, cause: "Invalid code" });
      }
    } else {
      res.send({ success: false, cause: "Link Expire" });
    }
  } else {
    res.send({ success: false, cause: "user Not Exist" });
  }
});
module.exports = router;
