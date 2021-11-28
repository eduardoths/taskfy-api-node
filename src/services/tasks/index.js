export const NewTaskService = (repositoryContainer) => {
  const repo = repositoryContainer.TaskRepository;

  const create = async (
    name,
    dueDate,
    stressPoints,
    taskAssignedId,
    listId
  ) => {
    return await repo.create(
      name,
      dueDate,
      stressPoints,
      taskAssignedId,
      listId
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
    listId
  ) => {
    if (await exists(taskId))
      return await repo.update(
        taskId,
        name,
        dueDate,
        stressPoints,
        taskAssignedId,
        listId
      );
    return { errors: "task.not-found" };
  };

  const deleteTask = async (taskId) => {
    if (await exists(taskId)) return await repo.deleteTask(taskId);
    return { errors: "task.not-found" };
  };

  const exists = async (taskId) => {
    return await repo.exists(taskId);
  };

  return {
    get,
    create,
    update,
    deleteTask,
    exists,
  };
};
