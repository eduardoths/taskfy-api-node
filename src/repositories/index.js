import { NewTaskRepository } from "./tasks";
import { NewListRepository } from "./lists";
import { NewBoardRepository } from "./boards";
import { NewUserRepository } from "./users";
import { NewManagerRepository } from "./users/managers";
import { NewOrganizationRepository } from "./organizations";

export const NewRepositoryContainer = (database) => {
  return {
    UserRepository: NewUserRepository(database),
    BoardRepository: NewBoardRepository(database),
    ListRepository: NewListRepository(database),
    TaskRepository: NewTaskRepository(database),
    ManagerRepository: NewManagerRepository(database),
    OrganizationRepository: NewOrganizationRepository(database),
  };
};
