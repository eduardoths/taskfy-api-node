import { NewListRepository } from "../lists";

export const NewTaskRepository = (database) => {
  const db = database;

  const stressPointsInvalid = "stress-points.invalid";
  const nameInvalid = "name.invalid";
  const dueDateInvalid = "due-date.invalid";

  const validateEmptyFields = (name, dueDate, stressPoints) => {
    let errors = [];
    if (!stressPoints) errors.push(stressPointsInvalid);
    if (!name) errors.push(nameInvalid);
    if (!dueDate) errors.push(dueDateInvalid);
    return errors;
  };

  const validateFields = (name, dueDate, stressPoints) => {
    let errors = [];
    let ts = Date.parse(dueDate);
    if (!isNaN(ts)) errors.push(dueDateInvalid);
    if (name.length < 3) errors.push(nameInvalid);
    if (stressPointsInvalid < 0) errors.push(stressPointsInvalid);
  };

  const transformName = (name) => {
    name = name.trim();
    name = name.replace(/\s+/g, " ");
    return name;
  };

  const fieldValidation = (name, dueDate, stressPoints) => {
    let errors = validateEmptyFields(name, dueDate, stressPoints);
    if (errors.length) return { errors: errors };
    name = transformName(name);
    errors = validateFields(name, dueDate, stressPoints);
    if (errors) return { errors: errors };
    return { ok: name };
  };

  const create = async (
    name,
    dueDate,
    stressPoints,
    taskAssignedId,
    listId,
    order
  ) => {
    const { errors, ok } = fieldValidation(name, dueDate, stressPoints);
    if (errors) return { errors: errors };
    name = ok;

    const dueDateDT = new Date(dueDate);

    const query = await db.task.create({
      data: {
        name: name,
        dueDate: dueDateDT,
        stressPoints: stressPoints,
        userId: taskAssignedId,
        listId: listId,
        order: order,
      },
    });
    return { ok: query };
  };

  const update = async (
    taskId,
    name,
    dueDate,
    stressPoints,
    taskAssignedId,
    listId,
    order
  ) => {
    const { errors, ok } = fieldValidation(name, dueDate, stressPoints);
    if (errors) return { errors: errors };
    name = ok;

    const dueDateDT = new Date(dueDate);

    const query = await db.task.update({
      where: {
        id: taskId,
      },
      data: {
        name: name,
        dueDate: dueDateDT,
        stressPoints: stressPoints,
        userId: taskAssignedId,
        listId: listId,
        order: order,
      },
    });

    return { ok: query };
  };

  const read = async (taskId) => {
    const query = await db.task.findUnique({
      where: {
        id: taskId,
      },
    });
    if (!query) return { errors: "task.not-found" };
    return { ok: query };
  };

  const deleteTask = async (taskId) => {
    const query = await db.task.delete({
      where: {
        id: taskId,
      },
    });
    return { ok: query };
  };

  const exists = async (taskId) => {
    const query = await db.task.count({
      where: {
        id: taskId,
      },
    });
    if (query != 0) return true;
    return false;
  };

  const tasksFromList = async (listId) => {
    const tasks = await db.task.findMany({
      where: { listId: listId },
      select: {
        id: true,
      },
    });
    const newList = [];
    for (let i = 0; i < tasks.length; i++) newList.push(tasks[i].id);
    return newList;
  };

  const updateOrder = async (tasks) => {
    let newOrder = [];
    for (let i = 0; i < tasks.length; i++) {
      newOrder.push(
        await db.task.update({
          where: {
            id: tasks[i],
          },
          data: {
            order: i + 1,
          },
        })
      );
    }
    return { ok: newOrder };
  };

  const maxOrder = async (listId) => {
    const max = await db.task.aggregate({
      where: {
        listId: listId,
      },
      _max: {
        order: true,
      },
    });
    return max._max.order;
  };

  return {
    create,
    read,
    update,
    deleteTask,
    exists,
    tasksFromList,
    updateOrder,
    maxOrder,
  };
};
