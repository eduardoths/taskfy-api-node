import prisma from "../helpers/prisma";

export const createBoard = async (boardName, color) => {
  const board = await prisma.board.create({
    data: {
      name: boardName,
      color: color,
    },
  });
  return board.id;
};

export const deleteBoardFromDB = async (id) => {
  await prisma.board.update({
    where: {
      id: id,
    },
    data: {
      manager: {
        deleteMany: {},
      },
    },
  });
  await prisma.board.delete({
    where: {
      id: id,
    },
  });
};

export const getUserBoards = async (userId) => {
  const userBoards = await prisma.board.findMany({
    where: {
      users: {
        some: {},
      },
    },
  });
  const managerBoards = await prisma.board.findMany({
    where: {
      manager: {
        some: {},
      },
    },
  });
  return { boards: { asUser: userBoards, asManager: managerBoards } };
};
