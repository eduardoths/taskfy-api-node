import prisma from "../helpers/prisma";

export const isEmailUnique = async (email) => {
  const uniqueEmail = await prisma.user.findFirst({
    where: { email: email },
  });
  return !uniqueEmail;
};

export const isUsernameUnique = async (username) => {
  const uniqueUsername = await prisma.user.findFirst({
    where: { username: username },
  });
  return !uniqueUsername;
};

export const createUser = async (
  firstName,
  lastName,
  email,
  username,
  passwordHash
) => {
  return await prisma.user.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      passwordHash: passwordHash,
    },
  });
};

export const loginUser = async (emailOrUsername, isEmail) => {
  const whereClause = isEmail
    ? { email: emailOrUsername }
    : { username: emailOrUsername };
  return await prisma.user.findFirst({
    where: whereClause,
  });
};
