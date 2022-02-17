import { Model } from "mongoose";
import { Router } from "express";
const express = require("express");
const router: Router = express.Router();
const userModel: typeof Model = require("../../model/userModel");

//! /finder
router.post("/finder", async (req, res) => {
  const finder = req.body.finder;
  const selection = req.body.selection;
  const find = await userModel.find(finder).select(selection);
  res.send(find);
});

module.exports = router;
