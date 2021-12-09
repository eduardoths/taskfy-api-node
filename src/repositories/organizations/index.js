export const NewOrganizationRepository = (database) => {
  const db = database;

  const create = async (domain) => {
    try {
      domain = domain.split(".")[0];
    } catch {}
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
    await db.user.update({
      where: { id: userId },
      data: {
        Managers: {
          deleteMany: {},
        },
        Boards: {
          deleteMany: {},
        },
      },
    });
    const query = await db.user.delete({
      where: {
        id: userId,
      },
    });
    return { ok: query };
  };

  const listUsers = async (organizationId) => {
    let users = await db.$queryRaw`
    SELECT
      u.id,
      u."isAdmin",
      u."firstName",
      u."lastName",
      u."username",
      u."email",
      u."createdAt",
      u."updatedAt"
    FROM organizations o
    JOIN users u ON o.id = u."organizationId"
    WHERE o.id = ${organizationId}
    `;
    return users;
  };

  const listBoards = async (organizationId) => {
    let boards = await db.$queryRaw`
    SELECT DISTINCT b.*
    FROM organizations o
    JOIN users u ON o.id = u."organizationId"
    JOIN managers m ON u.id = m."managerId"
    JOIN boards b ON b.id = m."boardId"
    WHERE o."id" = ${organizationId}
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
