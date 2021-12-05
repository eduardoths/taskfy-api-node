export const NewTaskController = (serviceContainer) => {
  const managerService = serviceContainer.ManagerService;
  const boardService = serviceContainer.BoardService;
  const listService = serviceContainer.ListService;
  const taskService = serviceContainer.TaskService;

  const userDoesntBelongToBoard = { errors: "user.doesnt-belong-to-board" };
  const listDoesntBelongToBoard = { errors: "list.doesnt-belong-to-board" };
  const taskDoesntBelongToList = { errors: "task.doesnt-belong-to-list" };
  const notAllowed = { errors: "user.not-allowed" };

  const userIsValid = async (boardId, userId) => {
    const result = await boardService.containsUser(boardId, userId);
    if (result) return;
    return userDoesntBelongToBoard;
  };

  const validateList = async (listId, boardId) => {
    const actualBoardId = await listService.getBoard(listId);
    if (actualBoardId == boardId) return;
    return listDoesntBelongToBoard;
  };

  const hasPermission = async (boardId, userId) => {
    const result = await managerService.isManagerOfBoard(boardId, userId);
    if (result) return;
    return notAllowed;
  };

  const create = async (
    { name, dueDate, stressPoints, taskAssignedId },
    listId,
    boardId,
    userId
  ) => {
    if (!(await userIsValid(taskAssignedId))) return userDoesntBelongToBoard;
    const listErrors = await validateList(listId, boardId);
    if (listErrors) return listErrors;
    if (await hasPermission(boardId, userId)) return notAllowed;

    return await taskService.create(
      name,
      dueDate,
      stressPoints,
      taskAssignedId,
      listId
    );
  };

  const update = async (
    taskId,
    { name, dueDate, stressPoints, taskAssignedId, newListId },
    listId,
    boardId,
    userId
  ) => {
    if (!(await userIsValid(taskAssignedId))) return userDoesntBelongToBoard;
    const listErrors = await validateList(listId, boardId);
    if (listErrors) return listErrors;
    if (await hasPermission(boardId, userId)) return notAllowed;
    if (!newListId) newListId = listId;
    return await taskService.update(
      taskId,
      name,
      dueDate,
      stressPoints,
      taskAssignedId,
      newListId,
      listId,
      boardId
    );
  };

  const deleteTask = async (taskId, listId, boardId, userId) => {
    const listErrors = await validateList(listId, boardId);
    if (listErrors) return listErrors;
    if (await hasPermission(boardId, userId)) return notAllowed;

    return await taskService.deleteTask(listId, taskId);
  };

  const get = async (taskId, listId, boardId, userId) => {
    if (!(await userIsValid(userId))) return userDoesntBelongToBoard;
    const listErrors = await validateList(listId, boardId);
    if (listErrors) return listErrors;

    return await taskService.get(taskId);
  };

  const updateOrder = async (userId, boardId, listId, tasks) => {
    if (await validateList(listId, boardId)) return listDoesntBelongToBoard;
    if (await hasPermission(boardId, userId))
      return { errors: "operation.forbidden" };
    return await taskService.updateOrder(listId, tasks);
  };

  return {
    create,
    update,
    deleteTask,
    get,
    updateOrder,
  };
};
