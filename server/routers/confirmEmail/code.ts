import { Router } from "express";
import { Model } from "mongoose";
const express = require("express");
const router: Router = express.Router();
const usersModel: typeof Model = require("../../modules/userModules");

//! confirmEmail/:code
router.get("/confirmEmail/:userName/:code", async (req, res) => {
  const { code, userName } = req.params;
  const userInfo: any = await usersModel.find({ userName });

  if (userInfo.length === 0) return res.status(404).send("404Page");
  if (userInfo[0].emailInfo.Active) return res.send("your Link expired");
  if (userInfo[0].emailInfo.code !== code) return res.send("your Link invalid");

  const emailInfo = (userInfo[0].emailInfo = {
    email: userInfo[0].emailInfo.email,
    Active: true,
  });

  await usersModel.findOneAndUpdate({ userName }, { emailInfo });
  res.send("success");
});

module.exports = router;
