import {
  createBoard,
  deleteBoardFromDB,
  getUserBoards,
} from "../repositories/boards";
import { addManager, isManagerOfBoard } from "./managers";

const colorRegex = /[#][0-9a-f]{6}/;

const createValidations = (boardName, color) => {
  if (!boardName || !color) return { error: "body.missing-params" };
  if (!colorRegex.test(color)) return { error: "color.invalid" };
  if (boardName.length < 3) return { error: "name.short" };
};

export const create = async ({ body }) => {
  let { boardName, color } = body;
  color = color.toLowerCase();
  let error = createValidations(boardName, color);
  if (error) return { error: error };

  const boardID = await createBoard(boardName, color);
  addManager(boardID, body.user.id);
  return { ok: { boardID } };
};

export const deleteBoard = async ({ body }, id) => {
  const { user } = body;
  let { ok, error } = isManagerOfBoard(user.id, id);
  if (error) {
    // TODO verify if it's Admin of organization
    return { error: error };
  }
  await deleteBoardFromDB(id);
  return { ok: id };
};

export const getAllUserBoards = async (userId) => {
  return await getUserBoards(userId);
};
