import { NewUserService } from "./users";
import { NewManagerService } from "./users/managers";
import { NewBoardService } from "./boards";
import { NewListService } from "./lists";
import { NewTaskService } from "./tasks";
import { NewOrganizationService } from "./organizations";

export const NewServiceContainer = (
  repositoryContainer,
  jwt,
  passwordEncryption
) => {
  return {
    UserService: NewUserService(repositoryContainer, jwt, passwordEncryption),
    OrganizationService: NewOrganizationService(repositoryContainer),
    ManagerService: NewManagerService(repositoryContainer),
    BoardService: NewBoardService(repositoryContainer),
    ListService: NewListService(repositoryContainer),
    TaskService: NewTaskService(repositoryContainer),
  };
};
