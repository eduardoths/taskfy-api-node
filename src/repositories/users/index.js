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

  const updateUserToAdmin = async (userId) => {
    return {
      ok: await db.user.update({
        where: {
          id: userId,
        },
        data: {
          isAdmin: true,
        },
      }),
    };
  };

  const exists = async (userId) => {
    let user = await db.user.findUnique({
      where: { id: userId },
    });
    if (user) return true;
    return false;
  };

  const isAdmin = async (userId) => {
    let admin = await db.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (admin) return admin.isAdmin;
    return false;
  };

  return {
    isEmailUnique,
    isUsernameUnique,
    signup,
    signinWithEmail,
    signinWithUsername,
    updateUser,
    exists,
    updateUserToAdmin,
    isAdmin,
  };
};
