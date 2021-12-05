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
          orderBy: {
            order: "asc",
          },
        },
        users: {
          select: { User: true },
        },
        manager: {
          select: { User: true },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
    for (let i = 0; i < board.users.length; i++) {
      board.users[i] = board.users[i].User;
    }
    for (let i = 0; i < board.manager.length; i++) {
      board.manager[i] = board.manager[i].User;
    }
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

  const removeUser = async (boardId, userId) => {
    return await db.$queryRaw`
      DELETE FROM virtual_boards vb
      WHERE "userId" = ${userId} AND "boardId"= ${boardId}
    `;
  };

  const getDoneList = async (boardId) => {
    const list = await db.$queryRaw`
      SELECT l.*
      FROM boards b
      JOIN lists l ON l."boardId" = b.id
      WHERE b.id = ${boardId}
      ORDER BY l."createdAt" ASC
      LIMIT 1
    `;
    return list[0];
  };

  const endsAt = async (boardId) => {
    const endsAt = await db.$queryRaw`
      SELECT MAX(t."dueDate") dueDate
      FROM boards b
      JOIN lists l ON l."boardId" = b.id
      JOIN tasks t ON t."listId" = l.id
      WHERE b.id = ${boardId}
      LIMIT 1
    `;
    return endsAt[0].duedate;
  };

  const getGraph = async (boardId, listDoneId, begins, ends) => {
    const begin = new Date(begins.toString());
    const end = new Date(ends.toString());
    const dates = await db.$queryRaw`
      WITH all_dates AS (
        SELECT DISTINCT DATE("createdAt") date
        FROM boards
        UNION ALL
        SELECT DISTINCT DATE(t."dueDate") date
        FROM boards b
        JOIN lists l ON l."boardId" = b.id
        JOIN tasks t ON t."listId" = l.id
        WHERE b.id = ${boardId}
        UNION ALL
        SELECT DISTINCT DATE(t."updatedAt") date
        FROM boards b
        JOIN lists l ON l."boardId" = b.id
        JOIN tasks t ON t."listId" = l.id
        WHERE b.id = ${boardId}
          AND l.id = ${listDoneId}
      ), valid_dates AS (
        SELECT DISTINCT
          date
        FROM all_dates
        WHERE date >= ${begin}
          AND date <= ${end}
        ORDER BY date
      ), done_tasks AS (
        SELECT
          date,
          SUM(points) soma
        FROM (
          SELECT 
            vd.date, 
            COALESCE(t."stressPoints", 0) points
          FROM valid_dates vd
          LEFT JOIN (
            SELECT t.* FROM tasks t
            JOIN lists l ON t."listId" = l.id
            JOIN boards b ON l."boardId" = b.id
            WHERE b.id = ${boardId}
              AND l.id = ${listDoneId}
            ) t ON DATE(t."updatedAt") <= vd.date
        ) done
        WHERE date <= ${new Date()}
        GROUP BY 1
        ORDER BY 1
      ), due_tasks AS (
        SELECT
          date,
          SUM(points) soma
        FROM (
          SELECT 
            vd.date, 
            COALESCE(t."stressPoints", 0) points
          FROM valid_dates vd
          LEFT JOIN (
          SELECT t.* FROM tasks t
            JOIN lists l ON t."listId" = l.id
            JOIN boards b ON l."boardId" = b.id
            WHERE b.id = ${boardId}
          ) t ON DATE(t."dueDate") <= vd.date
        ) due
        GROUP BY 1
        ORDER BY 1
      ), total_points AS (
        SELECT SUM(t."stressPoints")
        FROM tasks t
        JOIN lists l ON t."listId" = l.id
        JOIN boards b ON l."boardId" = b.id
        WHERE b.id = ${boardId}
      )
      SELECT 
        due.date,
        total_points.sum - COALESCE(due.soma, 0) recommended,
        total_points.sum - done.soma situation
      FROM total_points, due_tasks due
      LEFT JOIN done_tasks done ON done.date = due.date
        
    `;
    return dates;
  };

  const updateName = async (boardId, name) => {
    const result = await db.board.update({
      where: {
        id: boardId,
      },
      data: {
        name: name,
      },
    });
  };

  return {
    addUser,
    getGraph,
    endsAt,
    removeUser,
    create,
    deleteBoard,
    boardsFromUser,
    exists,
    containsUser,
    getBoard,
    getOrganization,
    getDoneList,
    updateName,
  };
};
