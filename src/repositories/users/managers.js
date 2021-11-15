export const NewManagerRepository = (database) => {
  const db = database;

  const addManagerToBoard = async (boardId, managerId) => {
    await db.manager.create({
      data: {
        boardId: boardId,
        managerId: managerId,
      },
    });
  };

  const isManagerOfBoard = async (boardId, managerId) => {
    await db.manager.findFirst({
      where: {
        boardId: boardId,
        managerId: managerId,
      },
    });
  };

  const getManagerByBoard = async (boardId) => {
    return await db.manager.findMany({
      where: {
        boardId: boardId,
      },
    });
  };

  const getManagedByUser = async (userId) => {
    return await db.manager.findMany({
      where: {
        managerId: userId,
      },
    });
  };

  return {
    addManagerToBoard,
    isManagerOfBoard,
    getManagerByBoard,
    getManagedByUser,
  };
};
