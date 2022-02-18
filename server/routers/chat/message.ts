import { Router } from "express";
import { Model } from "mongoose";
const express = require("express");
const router: Router = express.Router();
const messageModel: typeof Model = require("../../model/messageModel");

//! AddMassage
router.post("/chat/message", async (req, res) => {
  const conversationId = req.body.conversationId;
  const sender = req.body.sender;
  const text = req.body.text;
  const NewMassage = new messageModel({
    conversationId,
    sender,
    text,
  });
  try {
    await NewMassage.save().then((result: any) => res.send(result));
  } catch (error) {
    res.status(500).send({ result: "failed", error });
  }
});

//! editMessage
router.post("/chat/editMessage", async (req, res) => {
  const messageId = req.body.messageId;
  const text = req.body.text;

  await messageModel
    .findByIdAndUpdate(messageId, { text })
    .then((result) => {
      result.text = text;
      res.send(result);
    })
    .catch((error) => res.status(500).send(error));
});

//! deleteMessage
router.post("/chat/deleteMessage", async (req, res) => {
  const messageId = req.body.messageId;
  await messageModel
    .findByIdAndRemove(messageId)
    .then(() => {
      res.send({ result: "success" });
    })
    .catch((error) => res.status(500).send(error));
});

//! getMessage By conversationId
router.get("/chat/message/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  await messageModel
    .find({ conversationId })
    .then((result: Array<any>) => {
      if (!result || result.length === 0) res.send([]);
      res.send({ result });
    })
    .catch((error) => res.status(500).send({ result: "failed", error }));
});

//! get lastMessage By conversationsId
router.post("/chat/lastMessage", async (req, res) => {
  const conversationsId = req.body.conversationsId;
  if (!Array.isArray(conversationsId))
    res.status(500).send("invalid_data_Post");
  let data: any = [];
  for (let i = 0; i < conversationsId.length; i++) {
    await messageModel
      .find({ conversationId: conversationsId[i] })
      .sort({ _id: -1 })
      .limit(1)
      .then((result) => data.push(result[0]))
      .catch((error) => res.status(500).send({ result: "failed", error }));
  }
  res.send(data);
});

module.exports = router;
