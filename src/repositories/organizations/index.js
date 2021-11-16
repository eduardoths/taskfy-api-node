export const NewOrganizationRepository = (database) => {
  const db = database;

  const create = async (domain) => {
    const org = await db.organization.create({
      data: {
        companyName: domain,
      },
    });
    return org.id;
  };

  const getByDomain = async (domain) => {
    const org = await db.organization.findFirst({
      where: {
        companyName: domain,
      },
    });
    if (org) return org.id;
    return null;
  };

  return { create, getByDomain };
};
