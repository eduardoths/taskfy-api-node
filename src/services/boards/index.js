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
    const boardId = await repo.create(boardName, color);
    return { ok: boardId };
  };

  const allUserBoards = async (id) => {
    const boards = await repo.boardsFromUser(id);
    return { ok: boards };
  };

  const update = async (id) => {};

  const deleteBoard = async (id) => {
    const board = await repo.deleteBoard(id);
    if (board == null) return { errors: "board.not-found" };
    return { ok: "board.deleted" };
  };

  const addUser = async (boardId, userId) => {
    return await repo.addUser(boardId, userId);
  };

  return {
    addUser,
    create,
    allUserBoards,
    update,
    deleteBoard,
  };
};
