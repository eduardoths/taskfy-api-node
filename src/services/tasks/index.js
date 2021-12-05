import match from "../../../internal/arrayutils/match";

export const NewTaskService = (repositoryContainer) => {
  const repo = repositoryContainer.TaskRepository;

  const create = async (
    name,
    dueDate,
    stressPoints,
    taskAssignedId,
    listId
  ) => {
    const order = await repo.maxOrder(listId);
    return await repo.create(
      name,
      dueDate,
      stressPoints,
      taskAssignedId,
      listId,
      order + 1
    );
  };

  const get = async (taskId) => {
    return await repo.read(taskId);
  };

  const update = async (
    taskId,
    name,
    dueDate,
    stressPoints,
    taskAssignedId,
    listId,
    oldListId
  ) => {
    let order;
    if (oldListId !== listId) {
      order = (await repo.maxOrder(listId)) + 1;
    } else {
      order = await repo.read(taskId).order;
    }
    let updated;
    if (await exists(taskId))
      updated = await repo.update(
        taskId,
        name,
        dueDate,
        stressPoints,
        taskAssignedId,
        listId,
        order
      );
    if (oldListId !== listId) {
      const newOrder = await repo.tasksFromList(oldListId);
      repo.updateOrder(newOrder);
    }
    return { ok: updated };
  };

  const deleteTask = async (listId, taskId) => {
    if (await exists(taskId)) {
      const deleted = await repo.deleteTask(taskId);
      const newOrder = await repo.tasksFromList(listId);
      await repo.updateOrder(newOrder);
      return deleted;
    }
    return { errors: "internal server error" };
  };

  const exists = async (taskId) => {
    return await repo.exists(taskId);
  };

  const updateOrder = async (listId, tasks) => {
    const currentTasks = await repo.tasksFromList(listId);
    if (!match(tasks, currentTasks)) return { errors: "list.invalid" };
    return await repo.updateOrder(tasks);
  };

  return {
    get,
    create,
    update,
    deleteTask,
    exists,
    updateOrder,
  };
};
