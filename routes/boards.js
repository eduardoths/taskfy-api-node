var express = require("express");
var router = express.Router();

import { ensureAuth } from "../middlewares/ensureAuth";
import { create } from "../controllers/boards";

router.use(ensureAuth);

router.post("/", async (req, res, next) => {
  const { ok, error } = await create(req);
  if (error) return res.status(400).json(error);
  return res.status(200).json(ok);
});

module.exports = router;
