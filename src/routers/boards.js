import { Router } from "express";

import { ensureAuth } from "../middlewares/ensureAuth";

const BoardRouter = (
  ControllerContainer,
  ServiceContainer,
  authmiddleware = ensureAuth
) => {
  const boardController = ControllerContainer.BoardController;
  const boardService = ServiceContainer.BoardService;
  var router = Router();
  router.use(authmiddleware);

  router.post("/", async (req, res, next) => {
    const { id } = res.locals.user;
    const { ok, errors } = await boardController.create(req.body, id);
    if (errors) return res.status(400).json(errors);
    return res.status(201).json({ data: ok });
  });

  router.delete("/:id", async (req, res, next) => {
    const boardId = req.params.id;
    const userId = res.locals.user.id;
    const { ok, errors } = await boardController.deleteBoard(boardId, userId);
    if (ok) return res.status(204).json();

    if (errors == "operation.forbidden")
      return res.status(403).json({ errors: errors });
    if (errors == "board.not-found")
      return res.status(404).json({ errors: errors });
    return res.status(400).json({ errors: errors });
  });

  router.get("/", async (req, res, next) => {
    const userId = res.locals.user.id;
    let { ok } = await boardService.allUserBoards(userId);
    return res.status(200).json({ data: ok });
  });

  return router;
};

export default BoardRouter;
