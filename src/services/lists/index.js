export const NewListService = (repositoryContainer) => {
  const repo = repositoryContainer.ListRepository;

  const create = async (boardId, name) => {
    const response = await repo.create(boardId, name);
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

  const deleteList = async (listId) => {
    const { ok, errors } = await repo.deleteList(listId);
    if (errors) return { errors: errors };
    return { ok: ok };
  };

  const exists = async (listId) => {
    return await repo.exists(listId);
  };
<<<<<<< HEAD

  const getBoard = async (listId) => {
    return await repo.getBoard(listId);
  };
=======
>>>>>>> main

  return {
    create,
    update,
    deleteList,
    exists,
<<<<<<< HEAD
    getBoard,
=======
>>>>>>> main
  };
};
