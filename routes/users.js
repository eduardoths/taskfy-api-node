var express = require("express");
var router = express.Router();

import { signup, signin } from "../controllers/users";

router.get("/", async (req, res, next) => {
  res.json({ teste: "vai-tomar-no-c#-jacobo" });
});

router.post("/signup", async (req, res, next) => {
  res.json(await signup(req.body));
});

router.post("/signin", async (req, res, next) => {
  res.json(await signin(req.body));
});

module.exports = router;
