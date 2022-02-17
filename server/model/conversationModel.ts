import { model, Schema } from "mongoose";

enum RoleType {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

enum ConversationType {
  SINGLE = "SINGLE",
  GROPE = "GROPE",
}

const conversationSchema = new Schema(
  {
    members: [{ userName: String, name: String, role: String }],
    conversation: String,
  },
  { timestamps: true }
);

const conversationModel = model("conversations", conversationSchema);

module.exports = conversationModel;
