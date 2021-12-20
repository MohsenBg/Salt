import { Application, response } from "express";
const express = require("express");
const signIn = require("./routers/singIn");
const login = require("./routers/logIn");
const confirmEmail = require("./routers/confirmEmail/code");
const find = require("./routers/finder/index");
const app: Application = express();
const { connectServer } = require("./config/connection");
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(cors()).use(bodyParser.json());

app.use(express.static("public"));

//! signIn
app.use("", signIn);

//! login
app.use("", login);

//! confirmEmail/:userId/:code
app.use("", confirmEmail);

//! /finder/:parameter/:value/:selection
app.use("", find);
app.use("", (req, res) => {
  res
    .status(404)
    .sendFile("./public/src/404page/404page.html", { root: __dirname });
});

connectServer(app);
