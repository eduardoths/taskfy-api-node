var express = require("express");
var router = express.Router();

import { signup, signin } from "../controllers/users";

router.get("/", async (req, res, next) => {
  res.json({ teste: "vai-tomar-no-c#-jacobo" });
});

router.post("/signup", async (req, res, next) => {
  const { ok, error } = await signup(req.body);
  if (error) return res.status(400).json(error);
  return res.status(201).json(ok);
});

router.post("/signin", async (req, res, next) => {
  const { ok, error } = await signin(req.body);
  if (error) return res.status(400).json(error);
  return res.status(200).json(ok);
});

module.exports = router;
