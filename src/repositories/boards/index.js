export const NewBoardRepository = (database) => {
  const db = database;

  const create = async (boardName, color) => {
    const board = await db.board.create({
      data: {
        name: boardName,
        color: color,
      },
    });
    return board;
  };

  const deleteBoard = async (id) => {
    await db.board.update({
      where: {
        id: id,
      },
      data: {
        manager: {
          deleteMany: {},
        },
        users: {
          deleteMany: {},
        },
      },
    });
    return await db.board.delete({
      where: {
        id: id,
      },
    });
  };

  const boardsFromUser = async (userId) => {
    const asUser = await db.board.findMany({
      where: {
        users: {
          every: { userId: userId },
        },
      },
    });

    const asManager = await db.board.findMany({
      where: {
        manager: {
          every: { managerId: userId },
        },
      },
    });
    return { boards: { asUser: asUser, asManager: asManager } };
  };

  const addUser = async (boardId, userId) => {
    return await db.usersOnBoards.create({
      data: {
        boardId: boardId,
        userId: userId,
      },
    });
  };

  const exists = async (boardId) => {
    let board = await db.board.findUnique({ where: { id: boardId } });
    if (board) return true;
    return false;
  };

  const containsUser = async (boardId, userId) => {
    const count = await db.usersOnBoards.count({
      where: {
        boardId: boardId,
        userId: userId,
      },
    });

    if (count) return true;
    return false;
  };

  const getBoard = async (boardId) => {
    const board = await db.board.findUnique({
      where: {
        id: boardId,
      },
      select: {
        id: true,
        name: true,
        lists: {
          select: {
            id: true,
            name: true,
            tasks: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        users: true,
        manager: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return board;
  };

  const getOrganization = async (boardId) => {
    const result = await db.$queryRaw`
      SELECT o.id
      FROM virtual_boards vb
      JOIN users u ON vb."userId" = u.id 
      JOIN organizations o ON u."organizationId" = o.id
      WHERE vb."boardId" = ${boardId}
    `;
    return result[0].id;
  };

  return {
    addUser,
    create,
    deleteBoard,
    boardsFromUser,
    exists,
    containsUser,
    getBoard,
    getOrganization,
  };
};
