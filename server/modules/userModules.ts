import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      index: true,
      required: true,
    },
    password: {
      type: {
        salt: String,
        hash: String,
      },
      required: true,
    },
    emailInfo: {
      type: {
        code: {
          type: String,
          // expires: 300,
        },
        email: {
          type: String,
          index: true,
        },
        Active: Boolean,
      },
      required: true,
    },
  },
  { timestamps: true }
);

const usersModule = model("users", userSchema);

module.exports = usersModule;
