import prisma from "../helpers/prisma";

export const managerToBoard = async (boardID, managerID) => {
  await prisma.manager.create({
    data: {
      boardId: boardID,
      managerId: managerID,
    },
  });
};

export const managerFromUserAndBoard = async (userId, boardId) => {
  return await prisma.manager.findFirst({
    where: {
      boardId: boardId,
      managerId: userId,
    },
  });
};
