import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      index: true,
      unique: true,
      required: true,
    },
    name: {
      type: String,
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
          unique: true,
        },
        Active: Boolean,
      },
      required: true,
    },
    changePasswordCode: {
      type: String,
      required: false,
      expires: "10m",
    },
  },
  { timestamps: true }
);

const usersModule = model("users", userSchema);

module.exports = usersModule;
