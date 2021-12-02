export const NewOrganizationController = (serviceContainer) => {
  const organizationService = serviceContainer.OrganizationService;
  const userService = serviceContainer.UserService;

  const deleteUser = async (userId, organizationId) => {
    if (!(await organizationService.exists(organizationId)))
      return { errors: "organization.not-found" };
    if (!(await userService.exists(userId)))
      return { errors: "user.not-found" };
    return await organizationService.deleteUser(userId, organizationId);
  };

  const listUsers = async (organizationId) => {
    if (!(await organizationService.exists(organizationId)))
      return { errors: "organization.not-found" };
    return await organizationService.listUsers(organizationId);
  };

  const listBoards = async (organizationId) => {
    if (!(await organizationService.exists(organizationId)))
      return { errors: "organization.not-found" };
    return await organizationService.listBoards(organizationId);
  };

  return { deleteUser, listUsers, listBoards };
};
