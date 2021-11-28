import { NewUserController } from "./users";
import { NewBoardController } from "./boards";
import { NewListController } from "./lists";
<<<<<<< HEAD
import { NewTaskController } from "./tasks";
=======
>>>>>>> main

export const NewControllerContainer = (serviceContainer) => {
  return {
    UserController: NewUserController(serviceContainer),
    BoardController: NewBoardController(serviceContainer),
    ListController: NewListController(serviceContainer),
<<<<<<< HEAD
    TaskController: NewTaskController(serviceContainer),
=======
>>>>>>> main
  };
};
