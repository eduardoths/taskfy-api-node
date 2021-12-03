import e, { response, Router } from "express";

import { ensureAuth } from "../middlewares/ensureAuth";

const organizationRouter = (
  ControllerContainer,
  ServiceContainer,
  authMiddleware = ensureAuth
) => {
  const organizationController = ControllerContainer.OrganizationController;
  const organizationService = ServiceContainer.OrganizationService;
  const userService = ServiceContainer.UserService;
  const boardService = ServiceContainer.BoardService;

  var router = Router();
  const userIsAdmin = async (req, res, next) => {
    if (await userService.isAdmin(res.locals.user.id)) {
      const email = res.locals.user.email;
      const companyName = email.split("@")[1].split(".")[0];
      res.locals.company = companyName;
      next();
    } else {
      return res.status(403).json({ errors: "user.not-allowed" });
    }
  };
  router.use(authMiddleware);
  router.use(userIsAdmin);

  // Organizations

  //Listar todos os boards da empresa
  router.get("/boards", async (req, res) => {
    const companyName = res.locals.companyName;
    const { ok, errors } = await organizationController.listBoards(companyName);
    if (errors) {
      if (errors.includes("not-found"))
        return res.status(404).json({ errors: errors });
      if (errors.includes("forbidden"))
        return res.status(403).json({ errors: errors });
      return res.status(400).json({ errors: errors });
    }
    return res.status(200).json({ data: ok });
  });

  //Listar todos os usuarios da empresa
  router.get("/users", async (req, res) => {
    const companyName = res.locals.companyName;
    const { ok, errors } = await organizationController.listUsers(companyName);
    if (errors) {
      if (errors.includes("not-found"))
        return res.status(404).json({ errors: errors });
      if (errors.includes("forbidden"))
        return res.status(403).json({ errors: errors });
      return res.status(400).json({ errors: errors });
    }
    return res.status(200).json({ data: ok });
  });

  //Remover usuario da empresa
  router.delete("/:user_id", async (req, res) => {
    const { user_id } = req.params;

    const { ok, errors } = await organizationController.deleteUser(user_id);
    if (errors) return res.status(400).json(errors);
    return res.status(200).json({ data: ok });
  });

  //Adicionar administrador da empresa
  router.patch("/update/:user_id", authMiddleware, async (req, res, next) => {
    const userId = req.params.user_id;
    const requesterId = res.locals.user.id;
    const { ok, errors } = await userService.updateToAdmin(userId);
    if (errors) return res.status(400).json(errors);
    return res.status(200).json({ data: ok });
  });

  //Deletar Boards
  router.delete("/boards/:board_id", async (req, res, next) => {
    const boardId = req.params.board_id;
    const { ok, errors } = await boardService.deleteBoard(boardId);
    if (ok) return res.status(204).json();
    if (errors == "operation.forbidden")
      return res.status(403).json({ errors: errors });
    if (errors == "board.not-found")
      return res.status(404).json({ errors: errors });
    return res.status(400).json({ errors: errors });
  });

  return router;
};

export default organizationRouter;
