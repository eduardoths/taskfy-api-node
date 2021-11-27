import { Router } from "express";

import { ensureAuth } from "../middlewares/ensureAuth";

const BoardRouter = (
  ControllerContainer,
  ServiceContainer,
  authmiddleware = ensureAuth
) => {
  const boardController = ControllerContainer.BoardController;
  const boardService = ServiceContainer.BoardService;
  const listController = ControllerContainer.ListController;

  var router = Router();
  router.use(authmiddleware);

  // Boards

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

  // Lists

  router.post("/:board_id/lists", async (req, res) => {
    const { id } = res.locals.user;
    const boardId = req.params.board_id;

    const name = req.body.name;
    const { ok, errors } = await listController.create(boardId, id, name);
    if (errors == "board.not-found")
      return res.status(404).json({ errors: errors });
    else if (errors) return res.status(400).json({ errors: errors });
    return res.status(201).json({ data: ok });
  });

  router.put("/:board_id/lists/:list_id", async (req, res) => {
    const { id } = res.locals.user;
    const { board_id, list_id } = req.params;
    const name = req.body.name;

    const { ok, errors } = await listController.update(
      board_id,
      id,
      list_id,
      name
    );

    if (errors == "board.not-found")
      return res.status(404).json({ errors: errors });
    else if (errors) return res.status(400).json({ errors: errors });
    return res.status(200).json({ data: ok });
  });

  router.delete("/:board_id/lists/:list_id", async (req, res) => {
    const { id } = res.locals.user;
    const { board_id, list_id } = req.params;

    const { ok, errors } = await listController.deleteList(
      board_id,
      id,
      list_id
    );

    if (errors == "board.not-found" || errors == "list.not-found")
      return res.status(404).json({ errors: errors });
    else if (errors) return res.status(400).json({ errors: errors });
    return res.status(204).json();
  });

  return router;
};

export default BoardRouter;
