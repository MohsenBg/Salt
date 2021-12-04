import { Application, response } from "express";
const express = require("express");
const signIn = require("./routers/singIn");
const login = require("./routers/login");
const confirmEmail = require("./routers/confirmEmail/code");
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

app.use("", (req, res) => {
  res
    .status(404)
    .sendFile("./public/src/404page/404page.html", { root: __dirname });
});

connectServer(app);
