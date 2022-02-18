import { Router } from "express";
import { Model } from "mongoose";
const express = require("express");
const router: Router = express.Router();
const conversationModel: typeof Model = require("../../model/conversationModel");
const messageModel: typeof Model = require("../../model/messageModel");

//! AddConversation

router.post("/chat/conversation", async (req, res) => {
  const members = req.body.members;
  const conversation = req.body.ConversationType;
  const NewConversation = new conversationModel({
    members,
    conversation,
  });
  try {
    await NewConversation.save().then((result: any) => {
      res.send(result);
    });
  } catch (error) {
    res.status(500).send({ result: "failed", error });
  }
});

router.get("/chat/conversation/:username", async (req, res) => {
  const { username } = req.params;

  await conversationModel
    .find({
      members: { $elemMatch: { userName: username } },
    })
    .then(async (result) => {
      console.log(result);

      res.send(result);
    })
    .catch((error) => res.status(500).send({ result: "failed", error }));
});

module.exports = router;
