export const NewBoardController = (serviceContainer) => {
  const boardService = serviceContainer.BoardService;
  const managerService = serviceContainer.ManagerService;

  const create = async (body, userId) => {
    let { errors, ok } = await boardService.create(body);
    if (errors) return { errors: errors };
    const boardId = ok;
    managerService.addManager(boardId, userId);
    boardService.addUser(boardId, userId);
    return { ok: { boardId } };
  };

  const deleteBoard = async (boardId, userId) => {
    let operationAllowed = managerService.isManagerOfBoard(boardId, userId);
    if (!operationAllowed) {
      return { errors: "operation.forbidden" };
    }
    const result = await boardService.deleteBoard(boardId);
    return result;
  };

  return { create, deleteBoard };
};
