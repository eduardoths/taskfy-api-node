export const NewListController = (serviceContainer) => {
  const listService = serviceContainer.ListService;
  const managerService = serviceContainer.ManagerService;
  const boardService = serviceContainer.BoardService;

  const notAllowed = { errors: "user.not-allowed" };
  const boardNotFound = { errors: "board.not-found" };
  const listNotFound = { errors: "list.not-found" };
<<<<<<< HEAD
  const listDoesntBelongToBoard = { errors: "list.doesnt-belong-to-board" };
=======
>>>>>>> main

  const boardExists = async (boardId) => {
    return boardService.exists(boardId);
  };

  const listExists = async (listId) => {
    return listService.exists(listId);
  };

<<<<<<< HEAD
  const validateList = async (listId, boardId) => {
    const actualBoardId = await listService.getBoard(listId);
    if (actualBoardId == boardId) return;
    return listDoesntBelongToBoard;
  };

=======
>>>>>>> main
  const hasPermission = async (boardId, userId) => {
    return await managerService.isManagerOfBoard(boardId, userId);
  };

  const create = async (boardId, userId, name) => {
    if (!(await boardExists(boardId))) return boardNotFound;
    if (!(await hasPermission(boardId, userId))) return notAllowed;
    return await listService.create(boardId, name);
  };

  const update = async (boardId, userId, listId, name) => {
    if (!(await boardExists(boardId))) return boardNotFound;
    if (!(await listExists(listId))) return listNotFound;
<<<<<<< HEAD
    if (!(await validateList(listId, boardId))) return listDoesntBelongToBoard;
=======
>>>>>>> main
    if (!(await hasPermission(boardId, userId))) return notAllowed;
    return await listService.update(listId, name);
  };

  const deleteList = async (boardId, userId, listId) => {
    if (!(await boardExists(boardId))) return boardNotFound;
    if (!(await listExists(listId))) return listNotFound;
<<<<<<< HEAD
    if (!(await validateList(listId, boardId))) return listDoesntBelongToBoard;
=======
>>>>>>> main
    if (!(await hasPermission(boardId, userId))) return notAllowed;
    return await listService.deleteList(listId);
  };

  return {
    create,
    update,
    deleteList,
  };
};
