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

  const listBoards = async (companyId) => {
    if (!(await organizationService.exists(companyId)))
      return { errors: "organization.not-found" };
    return { ok: await organizationService.listBoards(companyId) };
  };

  return { deleteUser, listUsers, listBoards };
};
