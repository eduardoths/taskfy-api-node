export const NewUserController = (serviceContainer) => {
  const userService = serviceContainer.UserService;
  const organizationService = serviceContainer.OrganizationService;

  const signup = async (body) => {
    let { user, errors } = await userService.isSignupValid(body);
    if (errors) return { errors: errors };

    const { email } = user;
    let domain;
    try {
      domain = email.split("@")[1].split(".")[0];
    } catch {
      return { errors: "email.invalid" };
    }
    let orgId = await organizationService.getByDomain(domain);
    if (orgId) return await userService.signup(user, orgId, false);
    orgId = await organizationService.create(domain);
    return await userService.signup(user, orgId, true);
  };

  return { signup };
};
