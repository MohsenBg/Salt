import { Router } from "express";
const express = require("express");
const router: Router = express.Router();

router.get("/cookie/:CookieName", (req, res) => {
  const { CookieName } = req.params;
  switch (CookieName) {
    case "userLogin":
      if (typeof req.cookies.userLogin !== "undefined")
        res.send(req.cookies.userLogin);
      else res.send("cookie Expire");
      break;

    default:
      res.send("invalid Cookie");
      break;
  }
});

module.exports = router;
