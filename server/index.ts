//express
import { Application, response } from "express";
const express = require("express");

//connections
const { connectServer } = require("./config/connection");

//middleware
const bodyParser = require("body-parser");
import { CorsOptions } from "cors";
const cors = require("cors");
const cookieParser = require("cookie-parser");

//routers
const signup = require("./routers/signup");
const login = require("./routers/logIn");
const confirmEmail = require("./routers/confirmEmail/code");
const find = require("./routers/finder/index");
const app: Application = express();
const forgetPassword = require("./routers/forgetPassword/index");
const changePassword = require("./routers/forgetPassword/changePassword");
const sendConfirmEmail = require("./routers/confirmEmail/send");
app.use(cookieParser());
let optionsCors: CorsOptions = {
  origin: "*",
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
};
app.use(cors(optionsCors)).use(bodyParser.json());
app.use(express.static("public"));

//! forgetPassword
app.use("", forgetPassword);

//! forgetPassword/changePassword
app.use("", changePassword);

//! signup
app.use("", signup);

//! login
app.use("", login);

//! confirmEmail
app.use("", confirmEmail);

//! confirmEmail/send
app.use("", sendConfirmEmail);
//! finder
app.use("", find);

//!404_page
app.use("", (req, res) => {
  res
    .status(404)
    .sendFile("./public/src/404page/404page.html", { root: __dirname });
});

connectServer(app);
