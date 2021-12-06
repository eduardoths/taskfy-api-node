export const NewOrganizationService = (repositoryContainer) => {
  const repo = repositoryContainer.OrganizationRepository;

  const create = async (domain) => {
    return await repo.create(domain);
  };

  const getByDomain = async (domain) => {
    return await repo.getByDomain(domain);
  };

  const deleteUser = async (userId, organizationId) => {
    const user = await repo.deleteUser(userId, organizationId);
    if (user.errors) return { errors: user.errors };
    return { ok: "user.admin-removed" };
  };

  const exists = async (organizationId) => {
    return await repo.exists(organizationId);
  };

  const listUsers = async (organizationId) => {
    return await repo.listUsers(organizationId);
  };

  const listBoards = async (organizationId) => {
    return await repo.listBoards(organizationId);
  };

  return {
    create,
    getByDomain,
    exists,
    deleteUser,
    listUsers,
    listBoards,
  };
};
