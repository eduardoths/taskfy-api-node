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
  const taskController = ControllerContainer.TaskController;

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

  router.get("/:id", async (req, res) => {
    const userId = res.locals.user.id;
    const boardId = req.params.id;
    let { ok, errors } = await boardController.getBoard(boardId, userId);
    if (ok) return res.status(200).json({ data: ok });
    if (errors) {
      if (errors.includes("not-found"))
        return res.status(404).json({ data: errors });
      if (errors == "operation.forbidden")
        return res.status(403).json({ errors: errors });
    }
    return res.status(400).json({ errors: errors });
  });

  router.get("/:board_id/graph", async (req, res) => {
    const boardId = req.params.board_id;
    const { ok, errors } = await boardController.getGraph(boardId);
    if (errors) return res.status(400).json({ errors: errors });
    return res.status(200).json({ data: ok });
  });

  // User related
  router.post("/:board_id/user/:user_id", async (req, res) => {
    const managerId = res.locals.user.id;
    const boardId = req.params.board_id;
    const userId = req.params.user_id;

    const { ok, errors } = await boardController.addUser(
      boardId,
      userId,
      managerId
    );
    if (ok) return res.status(200).json({ data: ok });
    if (errors) {
      if (errors.includes("not-found"))
        return res.status(404).json({ errors: errors });
      if (errors == "operation.forbidden")
        return res.status(403).json({ errors: errors });
    }
    return res.status(400).json({ errors: errors });
  });

  router.delete("/:board_id/user/:user_id", async (req, res) => {
    const userRequestingId = res.locals.user.id;
    const boardId = req.params.board_id;
    const userId = req.params.user_id;

    const { ok, errors } = await boardController.removeUser(
      boardId,
      userId,
      userRequestingId
    );
    if (ok) return res.status(200).json({ data: ok });
    if (errors) {
      if (errors.includes("not-found"))
        return res.status(404).json({ errors: errors });
      if (errors == "operation.forbidden")
        return res.status(403).json({ errors: errors });
    }
    return res.status(400).json({ errors: errors });
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

  // Tasks

  router.post("/:board_id/lists/:list_id/tasks/", async (req, res) => {
    const { id } = res.locals.user;
    const { board_id, list_id } = req.params;

    const { ok, errors } = await taskController.create(
      req.body,
      list_id,
      board_id,
      id
    );
    if (errors) return res.status(400).json({ errors: errors });
    return res.status(200).json({ data: ok });
  });

  router.get("/:board_id/lists/:list_id/tasks/:task_id", async (req, res) => {
    const { id } = res.locals.user;
    const { board_id, list_id, task_id } = req.params;

    const { ok, errors } = await taskController.get(
      task_id,
      list_id,
      board_id,
      id
    );
    if (errors) {
      if (!Array.isArray(errors) && errors.includes("not-found"))
        return res.status(404).json({ errors: errors });
      return res.status(400).json({ errors: errors });
    }
    return res.status(200).json({ data: ok });
  });

  router.put("/:board_id/lists/:list_id/tasks/:task_id", async (req, res) => {
    const { id } = res.locals.user;
    const { board_id, list_id, task_id } = req.params;

    const { ok, errors } = await taskController.update(
      task_id,
      req.body,
      list_id,
      board_id,
      id
    );

    if (errors) {
      if (!Array.isArray(errors) && errors.includes("not-found"))
        return res.status(404).json({ errors: errors });
      return res.status(400).json({ errors: errors });
    }
    return res.status(200).json({ data: ok });
  });

  router.delete(
    "/:board_id/lists/:list_id/tasks/:task_id",
    async (req, res) => {
      const { id } = res.locals.user;
      const { board_id, list_id, task_id } = req.params;

      const { errors } = await taskController.deleteTask(
        task_id,
        list_id,
        board_id,
        id
      );

      if (errors) {
        if (!Array.isArray(errors) && errors.includes("not-found"))
          return res.status(404).json({ errors: errors });
        return res.status(400).json({ errors: errors });
      }
      return res.status(204).json();
    }
  );

  return router;
};

export default BoardRouter;
