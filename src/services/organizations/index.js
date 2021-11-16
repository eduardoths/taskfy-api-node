export const NewOrganizationService = (repositoryContainer) => {
  const repo = repositoryContainer.OrganizationRepository;

  const create = async (domain) => {
    return await repo.create(domain);
  };

  const getByDomain = async (domain) => {
    return await repo.getByDomain(domain);
  };

  return { create, getByDomain };
};
