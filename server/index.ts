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
const cookies = require("./routers/cookie/cookie");

app.use(cookieParser());
let optionsCors: CorsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
};
app.use(cors(optionsCors)).use(bodyParser.json());
app.use(express.static("public"));

//!cookie/:CookiesName
app.use("", cookies);

//! signup
app.use("", signup);

//! login
app.use("", login);

//! confirmEmail/:userId/:code
app.use("", confirmEmail);

//! /finder
app.use("", find);
app.use("", (req, res) => {
  res
    .status(404)
    .sendFile("./public/src/404page/404page.html", { root: __dirname });
});

connectServer(app);
