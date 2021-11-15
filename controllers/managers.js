import { managerToBoard, managerFromUserAndBoard } from "../models/managers";

export const addManager = async (boardID, managerID) => {
  await managerToBoard(boardID, managerID);
};

export const isManagerOfBoard = async (userId, boardId) => {
  const relation = await managerFromUserAndBoard(userId, boardId);
  if (relation) return { ok: "user.allowed" };
  return { error: "user.not-allowed" };
};
