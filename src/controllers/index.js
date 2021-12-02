import { NewUserController } from "./users";
import { NewBoardController } from "./boards";
import { NewListController } from "./lists";
import { NewTaskController } from "./tasks";
import { NewOrganizationController } from "./organizations";

export const NewControllerContainer = (serviceContainer) => {
  return {
    UserController: NewUserController(serviceContainer),
    BoardController: NewBoardController(serviceContainer),
    ListController: NewListController(serviceContainer),
    TaskController: NewTaskController(serviceContainer),
    OrganizationController: NewOrganizationController(serviceContainer),
  };
};
