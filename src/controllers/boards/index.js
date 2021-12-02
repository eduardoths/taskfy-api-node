import { NewListService } from "../../services/lists";

export const NewBoardController = (serviceContainer) => {
  const boardService = serviceContainer.BoardService;
  const listService = serviceContainer.ListService;
  const managerService = serviceContainer.ManagerService;
  const userService = serviceContainer.UserService;

  const create = async (body, userId) => {
    let { errors, ok } = await boardService.create(body);
    if (errors) return { errors: errors };
    const board = ok;
    managerService.addManager(board.id, userId);
    boardService.addUser(board.id, userId);
    listService.create(board.id, "Finalizadas");

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

  const removeUser = async (boardId, userId, requesterId) => {
    const isLeaving = userId == requesterId;
    const isManager = await managerService.isManagerOfBoard(
      boardId,
      requesterId
    );
    const userIsNotManager = !(await managerService.isManagerOfBoard(
      boardId,
      userId
    ));
    console.log(userIsNotManager, isLeaving, isManager);
    if (userIsNotManager && (isLeaving || isManager)) {
      if (!(await boardService.containsUser(boardId, userId)))
        return { errors: "board-user.not-found" };
      return { ok: boardService.removeUser(boardId, userId) };
    } else {
      return { errors: "operation.forbidden" };
    }
  };

  const getGraph = async (boardId) => {
    if (!(await boardService.exists(boardId)))
      return { errors: "board.not-found" };
    const doneList = await boardService.getDoneList(boardId);
    const { createdAt } = await boardService.getBoard(boardId);
    let endsAt = await boardService.endsAt(boardId);
    if (!endsAt) endsAt = createdAt;
    if (endsAt < createdAt) return { errors: "error.ends-before-begin" };

    return {
      ok: await boardService.getGraph(boardId, doneList.id, createdAt, endsAt),
    };
  };

  return { create, deleteBoard, getBoard, addUser, removeUser, getGraph };
};
