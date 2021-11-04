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
