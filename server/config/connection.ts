import { Application } from "express";
import { connect } from "mongoose";
require("dotenv").config();

const connectToMongo = connect(`${process.env.MONGO_DB_URL}`, {
  // //@ts-ignore
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
  // useUnifiedTopology: true,
})
  .then(() => console.log("mongodb connected"))
  .catch((err: any) => {
    console.log(err.message);
    process.exit(1);
  });

const connectServer = async (app: Application) => {
  await connectToMongo;
  app.listen(process.env.PORT || 5000, () => {
    console.log("SERVER_CONNECT_SUCCESSFULLY");
  });
};

module.exports = { connectServer };
