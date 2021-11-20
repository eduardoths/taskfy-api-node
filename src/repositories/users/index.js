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

  const updateEmail = async (userId, newEmail) => {
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: newEmail,
        username: user.username,
        passwordHash: user.passwordHash,
        organizationId: user.organizationId,
        isAdmin: user.isAdmin,
      },
    });
    return await db.user.findFirst({
      where: { email: newEmail },
    });
  };

  const updateUsername = async (userId, newUsername) => {
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: newUsername,
        passwordHash: user.passwordHash,
        organizationId: user.organizationId,
        isAdmin: user.isAdmin,
      },
    });
    return await db.user.findFirst({
      where: { username: newUsername },
    });
  };

  return {
    isEmailUnique,
    isUsernameUnique,
    signup,
    signinWithEmail,
    signinWithUsername,
    updateEmail,
    updateUsername,
  };
};
