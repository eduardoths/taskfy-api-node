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

  return {
    isEmailUnique,
    isUsernameUnique,
    signup,
    signinWithEmail,
    signinWithUsername,
  };
};
