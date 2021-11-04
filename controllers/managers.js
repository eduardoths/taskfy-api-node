import { managerToBoard } from "../models/managers";

export const addManager = async (boardID, managerID) => {
  await managerToBoard(boardID, managerID);
};
