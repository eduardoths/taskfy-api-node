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

export const getOrganizationId = async (emailDomain) => {
  const org = await prisma.organization.findFirst({
    where: {
      companyName: emailDomain,
    },
  });
  if (org) {
    return org.id;
  }
  return null;
};

export const createOrganization = async (emailDomain) => {
  const org = await prisma.organization.create({
    data: {
      companyName: emailDomain,
    },
  });
  return org.id;
};

export const createUser = async (
  firstName,
  lastName,
  email,
  username,
  passwordHash,
  organizationId,
  isAdmin
) => {
  return await prisma.user.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      passwordHash: passwordHash,
      organizationId: organizationId,
      isAdmin: isAdmin,
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
