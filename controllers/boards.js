import { getOrg } from "./users";
import { createBoard } from "../models/boards";
import { addManager } from "./managers";

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
