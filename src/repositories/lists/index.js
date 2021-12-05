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

  const create = async (boardId, name, order) => {
    if (!isNameValid(name)) return { errors: "list.name-short" };
    name = transformName(name);
    return await db.list.create({
      data: {
        name: name,
        boardId: boardId,
        order: order,
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
    await db.list.delete({ where: { id: id } });
    return { ok: "ok" };
  };

  const exists = async (listId) => {
    let list = await db.list.findUnique({ where: { id: listId } });
    if (list) return true;
    return false;
  };

  const getBoard = async (listId) => {
    let list = await db.list.findUnique({ where: { id: listId } });
    if (list) return list.boardId;
    return;
  };

  const listsFromBoard = async (boardId) => {
    const list = await db.list.findMany({
      where: { boardId: boardId },
      select: {
        id: true,
      },
    });
    const newList = [];
    for (let i = 0; i < list.length; i++) newList.push(list[i].id);
    return newList;
  };

  const updateOrder = async (lists) => {
    let newOrder = [];
    for (let i = 0; i < lists.length; i++) {
      newOrder.push(
        await db.list.update({
          where: {
            id: lists[i],
          },
          data: {
            order: i + 1,
          },
        })
      );
    }
    return { ok: newOrder };
  };

  const maxOrder = async (boardId) => {
    const max = await db.list.aggregate({
      where: {
        boardId: boardId,
      },
      _max: {
        order: true,
      },
    });
    return max._max.order;
  };

  return {
    create,
    update,
    deleteList,
    exists,
    getBoard,
    listsFromBoard,
    updateOrder,
    maxOrder,
  };
};
