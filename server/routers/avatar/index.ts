import { Router } from "express";
import { Model } from "mongoose";
const express = require("express");
const router: Router = express.Router();
const avatarModel: typeof Model = require("../../model/avatarModel");

//! AddAvatar

router.post("/avatar", async (req, res) => {
  const avatarData = req.body;
  const avatar = new avatarModel(avatarData);
  await avatar
    .save()
    .then((result: any) => {
      res.send(result);
    })
    .catch((error: any) => res.status(500).send(error));
});

//!EditAvatar
router.post("/avatar/edit", async (req, res) => {
  const avatarData = req.body;
  await avatarModel
    .findOneAndUpdate({ userName: avatarData.userName }, avatarData)
    .then(() => {
      res.send(avatarData);
    })
    .catch((error) => res.status(500).send(error));
});

//!getAvatar
router.get("/avatar/:userName", async (req, res) => {
  const { userName } = req.params;
  await avatarModel
    .findOne({ userName })
    .then((result) => {
      res.send(result);
    })
    .catch((error) => res.status(500).send(error));
});

module.exports = router;
