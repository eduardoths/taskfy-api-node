import { NewUserController } from "./users";
import { NewBoardController } from "./boards";

export const NewControllerContainer = (serviceContainer) => {
  return {
    UserController: NewUserController(serviceContainer),
    BoardController: NewBoardController(serviceContainer),
  };
};
