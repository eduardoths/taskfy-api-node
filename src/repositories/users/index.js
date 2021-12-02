export const NewUserRepository = (database) => {
  const db = database;

  const isEmailUnique = async (email) => {
    const user = await db.user.findFirst({
      where: {
        email: email,
      },
    });
    return (await user) == null;
  };

  const isUsernameUnique = async (username) => {
    const user = await db.user.findFirst({
      where: {
        username: username,
      },
    });
    return (await user) == null;
  };

  const signup = async (user) => {
    return await db.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        passwordHash: user.passwordHash,
        organizationId: user.organizationId,
        isAdmin: user.isAdmin,
      },
    });
  };
  const signinWithUsername = async (username) => {
    return await db.user.findFirst({
      where: { username: username },
    });
  };
  const signinWithEmail = async (email) => {
    return await db.user.findFirst({
      where: { email: email },
    });
  };

  const updateUser = async (userId, newUserInfos) => {
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        email: newUserInfos.email,
        username: newUserInfos.username,
      },
    });
    return await db.user.findFirst({
      where: { email: newUserInfos.email },
    });
  };

  const getOrganization = async (userId) => {
    const result = await db.$queryRaw`
    SELECT o.id
    FROM users u
    JOIN organizations o ON u."organizationId" = o.id
    WHERE u.id = ${userId}
    `;
    return result[0].id;
  };

  return {
    isEmailUnique,
    isUsernameUnique,
    signup,
    signinWithEmail,
    signinWithUsername,
    updateUser,
    getOrganization,
  };
};
