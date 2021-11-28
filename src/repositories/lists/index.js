export const NewListRepository = (database) => {
  const db = database;

  const isNameValid = (name) => {
    if (name.length < 3) return false;
    return true;
  };

  const transformName = (name) => {
    name = name.trim();
    name = name.replace(/\s+/g, " ");
    return name;
  };

  const create = async (boardId, name) => {
    if (!isNameValid(name)) return { errors: "list.name-short" };
    name = transformName(name);
    return await db.list.create({
      data: {
        name: name,
        boardId: boardId,
      },
    });
  };

  const update = async (id, name) => {
    if (!isNameValid(name)) return { errors: "list.name-short" };
    name = transformName(name);
    return await db.list.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });
  };

  const deleteList = async (id) => {
    const tasks = await db.task.count({
      where: {
        id: id,
      },
    });
    if (tasks > 0) return { errors: "list.has-tasks" };
    await db.list.delete({ where: { id: id } });
    return { ok: "ok" };
  };

  const exists = async (listId) => {
    let list = await db.list.findUnique({ where: { id: listId } });
    if (list) return true;
    return false;
  };
<<<<<<< HEAD

  const getBoard = async (listId) => {
    let list = await db.list.findUnique({ where: { id: listId } });
    if (list) return list.boardId;
    return;
  };
  return { create, update, deleteList, exists, getBoard };
=======
  return { create, update, deleteList, exists };
>>>>>>> main
};
