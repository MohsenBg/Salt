import { Router } from "express";
import { Model } from "mongoose";
const sha256 = require("sha256");
const express = require("express");
const router: Router = express.Router();
const userModel: typeof Model = require("../../model/userModel");
const conversationModel: typeof Model = require("../../model/conversationModel");
const messageModel: typeof Model = require("../../model/messageModel");

enum RoleType {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

enum Conversation_Type {
  SINGLE = "SINGLE",
  GROPE = "GROPE",
}

//! confirmEmail
router.post("/confirmEmail", async (req, res) => {
  const userName = req.body.userName;
  const code = req.body.code;

  //!check code and userName receive
  if (typeof code === "undefined" || typeof userName === "undefined")
    return res.send("invalid post");

  //!userInfo find By userName
  const userInfo: any = await userModel.find({ userName });

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

  const AddConversation = async (userName: string, name: string) => {
    const conversation = new conversationModel({
      members: [
        { role: RoleType.MEMBER, userName: "MohsenBg", name: "Mohsen" },
        {
          role: RoleType.MEMBER,
          userName: userName,
          name: name,
        },
      ],
      conversation: Conversation_Type.SINGLE,
    });
    await conversation.save().then(async (result: any) => {
      let message = new messageModel({
        conversationId: result._id,
        sender: "Mohsen",
        text: `hi👋
      welcome to salt-chat
      My name is Mohsen and I made this app.
      
      Tutorial 🤔
      1- you send Message Like other app\n
      2- you can edit or delete your message by double click or double touch on message\n
      3- green circle means user is online and gray means user is offline\n
      4- you can add emoji by click on emoji head left side the chat Box\n
      
      please if you any opinion or find any bug context me 
      GitHub:👇👇👇
      https://github.com/MohsenBg
      
      Next update(If I had time):
      1- add Groupe\n
      2- add calling\n
      3-Maybe fix some bug 🤣`,
      });
      await message.save();
    });
  };

  await userModel
    .findOneAndUpdate({ userName }, { emailInfo })
    .then(async () => {
      try {
        await AddConversation(userInfo[0].userName, userInfo[0].name);
      } catch (error) {
        console.log(error);
      }
      res.send("success");
    })
    .catch(() => res.send("Mongo Error"));
});

module.exports = router;
