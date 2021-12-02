export const NewBoardController = (serviceContainer) => {
  const boardService = serviceContainer.BoardService;
  const managerService = serviceContainer.ManagerService;
  const userService = serviceContainer.UserService;

  const create = async (body, userId) => {
    let { errors, ok } = await boardService.create(body);
    if (errors) return { errors: errors };
    const board = ok;
    managerService.addManager(board.id, userId);
    boardService.addUser(board.id, userId);
    return { ok: board };
  };

  const deleteBoard = async (boardId, userId) => {
    if (!(await boardService.exists(boardId)))
      return { errors: "board.not-found" };
    let operationAllowed = await managerService.isManagerOfBoard(
      boardId,
      userId
    );
    if (!operationAllowed) {
      return { errors: "operation.forbidden" };
    }
    return await boardService.deleteBoard(boardId);
  };

  const getBoard = async (boardId, userId) => {
    if (!(await boardService.exists(boardId)))
      return { errors: "board.not-found" };
    if (!(await boardService.containsUser(boardId, userId)))
      return { errors: "operaiton.forbidden" };
    return { ok: await boardService.getBoard(boardId) };
  };

  const addUser = async (boardId, userId, managerId) => {
    if (!(await boardService.exists(boardId)))
      return { errors: "board.not-found" };
    if (!(await managerService.isManagerOfBoard(boardId, managerId)))
      return { errors: "operaiton.forbidden" };
    const orgId = await boardService.getOrganization(boardId);
    const userOrgId = await userService.getOrganization(userId);

    if (orgId != userOrgId) return { errors: "operation.forbidden" };
    return { ok: await boardService.addUser(boardId, userId) };
  };

  return { create, deleteBoard, getBoard, addUser };
};
