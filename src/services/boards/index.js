import { colorRegex, minBoardNameLength } from "../../domain/board";

export const NewBoardService = (repositoryContainer) => {
  const repo = repositoryContainer.BoardRepository;

  const createInputValidations = ({ boardName, color }) => {
    if (!boardName || !color) return { errors: ["body.missing-params"] };
    if (!colorRegex.test(color)) return { errors: ["color.invalid"] };
    if (boardName.length < minBoardNameLength)
      return { errors: ["boardName.short"] };
    return { errors: [] };
  };

  const create = async (body) => {
    let { errors } = createInputValidations(body);
    if (errors.length) return { errors: errors };
    let { boardName, color } = body;
    color = color.toLowerCase();
    color = color.trim();
    const board = await repo.create(boardName, color);
    return { ok: board };
  };

  const allUserBoards = async (id) => {
    const boards = await repo.boardsFromUser(id);
    return { ok: boards };
  };

  const update = async (id) => {};

  const deleteBoard = async (id) => {
    const board = await repo.deleteBoard(id);
    if (board.errors) return { errors: board.errors };
    return { ok: "board.deleted" };
  };

  const addUser = async (boardId, userId) => {
    return await repo.addUser(boardId, userId);
  };

  const exists = async (boardId) => {
    return await repo.exists(boardId);
  };

  const containsUser = async (boardId, userId) => {
    return await repo.containsUser(boardId, userId);
  };

  const getBoard = async (boardId) => {
    return await repo.getBoard(boardId);
  };

  const getOrganization = async (boardId) => {
    return await repo.getOrganization(boardId);
  };

  const removeUser = async (boardId, userId) => {
    return await repo.removeUser(boardId, userId);
  };

  const getDoneList = async (boardId) => {
    return await repo.getDoneList(boardId);
  };

  const endsAt = async (boardId) => {
    return await repo.endsAt(boardId);
  };

  const getGraph = async (boardId, listId, begins, ends) => {
    return await repo.getGraph(boardId, listId, begins, ends);
  };

  const updateName = async (boardId, name) => {
    return await repo.updateName(boardId, name);
  };

  return {
    addUser,
    removeUser,
    create,
    allUserBoards,
    update,
    deleteBoard,
    exists,
    containsUser,
    getBoard,
    getOrganization,
    getDoneList,
    endsAt,
    getGraph,
    updateName,
  };
};
