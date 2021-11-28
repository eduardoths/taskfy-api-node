export const NewBoardController = (serviceContainer) => {
  const boardService = serviceContainer.BoardService;
  const managerService = serviceContainer.ManagerService;

  const boardExists = async (boardId) => {
    return await boardService.exists(boardId);
  };

  const create = async (body, userId) => {
    let { errors, ok } = await boardService.create(body);
    if (errors) return { errors: errors };
    const board = ok;
    managerService.addManager(board.id, userId);
    boardService.addUser(board.id, userId);
    return { ok: board };
  };

  const deleteBoard = async (boardId, userId) => {
    if (!(await boardExists(boardId))) return { errors: "board.not-found" };
    let operationAllowed = await managerService.isManagerOfBoard(
      boardId,
      userId
    );
    if (!operationAllowed) {
      return { errors: "operation.forbidden" };
    }
    return await boardService.deleteBoard(boardId);
  };

  return { create, deleteBoard };
};
