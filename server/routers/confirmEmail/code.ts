import { Router } from "express";
import { Model } from "mongoose";
const sha256 = require("sha256");
const express = require("express");
const router: Router = express.Router();
const usersModel: typeof Model = require("../../modules/userModules");

//! confirmEmail
router.post("/confirmEmail", async (req, res) => {
  const userName = req.body.userName;
  const code = req.body.code;

  //!check code and userName receive
  if (typeof code === "undefined" || typeof userName === "undefined")
    return res.send("invalid post");

  //!userInfo find By userName
  const userInfo: any = await usersModel.find({ userName });

  //!handel invalid Data
  if (userInfo.length === 0) return res.status(404).send("404Page");
  if (userInfo[0].emailInfo.Active)
    return res.send("user Email already confirm");
  if (userInfo[0].emailInfo.code !== sha256(code))
    return res.send("your Link invalid");

  const emailInfo = (userInfo[0].emailInfo = {
    email: userInfo[0].emailInfo.email,
    Active: true,
  });

  await usersModel
    .findOneAndUpdate({ userName }, { emailInfo })
    .then(() => res.send("success"))
    .catch(() => res.send("Mongo Error"));
});

module.exports = router;
