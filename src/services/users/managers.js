export const NewManagerService = (repositoryContainer) => {
  const repo = repositoryContainer.ManagerRepository;

  const addManager = async (boardId, managerId) => {
    return await repo.addManagerToBoard(boardId, managerId);
  };

  const isManagerOfBoard = async (boardId, managerId) => {
    const relation = await repo.isManagerOfBoard(boardId, managerId);
    if (relation) return true;
    return false;
  };

  return {
    addManager,
    isManagerOfBoard,
  };
};
