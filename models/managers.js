import prisma from "../helpers/prisma";

export const managerToBoard = async (boardID, managerID) => {
  await prisma.manager.create({
    data: {
      boardId: boardID,
      managerId: managerID,
    },
  });
};
