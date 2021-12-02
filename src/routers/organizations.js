import { response, Router } from "express";

import { ensureAuth } from "../middlewares/ensureAuth";

const BoardRouter = (
  ControllerContainer,
  ServiceContainer,
  authMiddleware = ensureAuth
) => {
  const organizationController = ControllerContainer.OrganizationController;
  const organizationService = ServiceContainer.OrganizationService;
  const userService = ServiceContainer.UserService;
  const boardService = ServiceContainer.BoardService;

  var router = Router();
  router.use(authMiddleware);

  // Organizations

  //Listar todos os boards da empresa
  router.get("/organization/boards", async (req, res) => {
    const organizationId = locals.organization.id;
    const boards = await organizationController.listBoards(organizationId);
    if (boards) return res.status(400);
    return res.status(200).json({ data: boards });
  });

  //Listar todos os usuarios da empresa
  router.get("/organization/users", async (req, res) => {
    const organizationId = locals.organization.id;
    const { ok, errors } = await organizationController.listUsers(
      organizationId
    );
    if (errors) return res.status(400).json(errors);
    return res.status(200).json({ data: ok });
  });

  //Remover usuario da empresa
  router.delete("/organization/:user_id", async (req, res) => {
    const { user_id } = req.params;
    const organizationId = res.locals.organization.id;

    const { ok, errors } = await organizationController.deleteUser(
      user_id,
      organizationId
    );
    if (errors) return res.status(400).json(errors);
    return res.status(200).json({ data: ok });
  });

  //Adicionar administrador da empresa
  router.patch(
    "/organization/update/:user_id",
    authMiddleware,
    async (req, res, next) => {
      const userId = req.params.user_id;
      const { ok, errors } = await userService.updateToAdmin(userId);
      if (errors) return res.status(400).json(errors);
      return res.status(200).json({ data: ok });
    }
  );

  //Deletar Boards
  router.delete("/organization/:board_id", async (req, res, next) => {
    const boardId = req.params.board_id;
    const userId = res.locals.user.id;
    const { ok, errors } = await boardController.deleteBoard(boardId, userId);
    if (ok) return res.status(204).json();
    if (errors == "operation.forbidden")
      return res.status(403).json({ errors: errors });
    if (errors == "board.not-found")
      return res.status(404).json({ errors: errors });
    return res.status(400).json({ errors: errors });
  });

  return router;
};

export default BoardRouter;
