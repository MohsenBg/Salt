import { model, Schema } from "mongoose";

const avatarSchema = new Schema({
  userName: String,
  topType: String,
  hairColor: String,
  accessoriesType: String,
  eyeType: String,
  eyebrowType: String,
  clotheType: String,
  clotheColor: String,
  facialHairType: String,
  facialHairColor: String,
  mouthType: String,
  skinColor: String,
});
const avatarModel = model("avatars", avatarSchema);
module.exports = avatarModel;
