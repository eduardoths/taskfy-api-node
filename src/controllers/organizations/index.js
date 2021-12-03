export const NewOrganizationController = (serviceContainer) => {
  const organizationService = serviceContainer.OrganizationService;
  const userService = serviceContainer.UserService;

  const deleteUser = async (userId, companyName) => {
    const organizationId = await organizationService.getByDomain(companyName);
    if (!(await organizationService.exists(organizationId)))
      return { errors: "organization.not-found" };
    if (!(await userService.exists(userId)))
      return { errors: "user.not-found" };
    return await organizationService.deleteUser(userId, organizationId);
  };

  const listUsers = async (companyName) => {
    const organizationId = await organizationService.getByDomain(companyName);
    if (!(await organizationService.exists(organizationId)))
      return { errors: "organization.not-found" };
    return { ok: await organizationService.listUsers(organizationId) };
  };

  const listBoards = async (companyName) => {
    if (!(await organizationService.exists(companyName)))
      return { errors: "organization.not-found" };
    return { ok: await organizationService.listBoards(organizationId) };
  };

  return { deleteUser, listUsers, listBoards };
};
