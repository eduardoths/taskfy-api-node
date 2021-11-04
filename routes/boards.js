var express = require("express");
var router = express.Router();

import { ensureAuth } from "../middlewares/ensureAuth";
import { create, deleteBoard } from "../controllers/boards";

router.use(ensureAuth);

router.post("/", async (req, res, next) => {
  const { ok, error } = await create(req);
  if (error) return res.status(400).json(error);
  return res.status(201).json(ok);
});

router.delete("/:id", async (req, res, next) => {
  const boardId = req.params.id;
  const { ok, error } = await deleteBoard(req, boardId);
  if (ok) return res.status(204).json(ok);
  if (error == "operation.forbidden") return res.status(403).json(error);
  return res.status(400).json(error);
});

module.exports = router;
