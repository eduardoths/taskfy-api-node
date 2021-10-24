var express = require("express");
var router = express.Router();

import { signup } from "../controllers/users";

router.get("/", async (req, res, next) => {
  res.json({ teste: "vai-tomar-no-c#-jacobo" });
});

router.post("/signup", async (req, res, next) => {
  res.json(await signup(req.body));
});

module.exports = router;
