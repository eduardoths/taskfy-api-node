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

  const deleteUser = async (userId, organizationId) => {
    await db.board.delete({
      where: {
        id: organizationId,
      },
      data: {
        users: {
          where: {
            id: userId,
          },
        },
      },
    });
    return { ok: ok };
  };

  const listUsers = async (organizationId) => {
    let users = await db.users.findMany({
      where: {
        organizationId: organizationId,
      },
    });
    return users;
  };

  const listBoards = async (organizationId) => {
    let boards = await db.$queryRaw`
    SELECT DISTINCT boards.*
    FROM organizations o
    JOIN users u ON o.id = u."organizationId"
    JOIN managers m ON u.id = m."managerId"
    JOIN boards b ON b.id = m"boardId"
    `;
    return boards;
  };

  const exists = async (organizationId) => {
    let organization = await db.organization.findUnique({
      where: { id: organizationId },
    });
    if (organization) return true;
    return false;
  };

  return { create, getByDomain, exists, deleteUser, listUsers, listBoards };
};
