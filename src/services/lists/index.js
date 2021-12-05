import match from "../../../internal/arrayutils/match";

export const NewListService = (repositoryContainer) => {
  const repo = repositoryContainer.ListRepository;

  const create = async (boardId, name) => {
    const order = await repo.maxOrder(boardId);
    const response = await repo.create(boardId, name, order + 1);
    const { errors } = response;
    if (errors) return { errors: errors };
    return { ok: response.id };
  };

  const update = async (listId, name) => {
    const response = await repo.update(listId, name);
    const { errors } = response;
    if (errors) return { errors: errors };
    return { ok: response.id };
  };

  const deleteList = async (boardId, listId) => {
    const { ok } = await repo.deleteList(listId);
    const newOrder = await repo.listsFromBoard(boardId);
    await repo.updateOrder(newOrder);
    return { ok: ok };
  };

  const exists = async (listId) => {
    return await repo.exists(listId);
  };

  const getBoard = async (listId) => {
    return await repo.getBoard(listId);
  };

  const updateOrder = async (boardId, lists) => {
    // validate if both lists has the same ids
    const currentLists = await repo.listsFromBoard(boardId);
    if (!match(lists, currentLists)) return { errors: "list.invalid" };
    return await repo.updateOrder(lists);
  };

  return {
    create,
    update,
    deleteList,
    exists,
    getBoard,
    updateOrder,
  };
};
