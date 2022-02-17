import { Router } from "express";
import { Model } from "mongoose";
const express = require("express");
const router: Router = express.Router();
const userModel: typeof Model = require("../../model/userModel");

//! /login
router.get("/search/:username", async (req, res) => {
  const { username } = req.params;
  await userModel
    .find({ userName: { $regex: username } })
    .select(["userName", "name"])
    .limit(10)
    .then((result) => res.send(result))
    .catch((error) => res.status(500).send({ result: "failed", error }));
});

module.exports = router;
