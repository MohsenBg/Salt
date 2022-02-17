import { model, Schema } from "mongoose";

const messageSchema = new Schema(
  {
    conversationId: String,
    sender: String,
    text: String,
  },
  { timestamps: true }
);

const messageModel = model("messages", messageSchema);

module.exports = messageModel;
