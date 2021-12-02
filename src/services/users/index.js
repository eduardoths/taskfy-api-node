import {
  minUsernameLength,
  maxUsernameLength,
  minPasswordLength,
  emailRegex,
  specialCharacters,
} from "../../domain/signup";

export const NewUserService = (repositoryContainer, jwt, passwordHasher) => {
  const repo = repositoryContainer.UserRepository;
  const jwtHelper = jwt();
  const passwordEncryption = passwordHasher();

  const signupEmptyFields = ({
    username,
    email,
    password,
    firstName,
    lastName,
  }) => {
    let errors = [];
    if (!firstName) errors.push("firstName.missing");
    if (!lastName) errors.push("lastName.missing");
    if (!password) errors.push("password.missing");
    if (!username) errors.push("username.missing");
    if (!email) errors.push("email.missing");
    return errors;
  };

  const signinEmptyFields = ({ emailOrUsername, password }) => {
    let errors = [];
    if (!emailOrUsername) {
      errors.push("email.missing");
      errors.push("username.missing");
    }
    if (!password) errors.push("password.missing");
    return errors;
  };

  const signupFormatting = ({
    username,
    email,
    firstName,
    lastName,
    password,
  }) => {
    username = username.toLowerCase();
    email = email.toLowerCase();
    email = email.trim();
    firstName = firstName.trim();
    lastName = lastName.trim();
    return {
      username: username,
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password,
    };
  };

  const signupValidation = ({
    username,
    email,
    password,
    firstName,
    lastName,
  }) => {
    let errors = [];
    if (username.length < minUsernameLength) errors.push("username.short");
    if (firstName.length < minUsernameLength) errors.push("firstName.short");
    if (lastName.length < minUsernameLength) errors.push("lastName.short");
    if (username.length > maxUsernameLength) errors.push("username.short");
    if (specialCharacters.test(username)) errors.push("username.invalid");
    if (specialCharacters.test(firstName)) errors.push("firstName.invalid");
    if (specialCharacters.test(lastName)) errors.push("lastName.invalid");
    if (emailRegex.test(email)) errors.push("email.invalid");
    if (password < minPasswordLength) errors.push("password.short");
    return errors;
  };

  const isSignupValid = async (body) => {
    let errors = signupEmptyFields(body);
    if (errors.length) return { errors: errors };
    let user = signupFormatting(body);
    errors = signupValidation(user);
    if (errors.length) return { errors: errors };
    if (!(await repo.isEmailUnique(user.email)))
      return { errors: "email.not-unique" };
    if (!(await repo.isUsernameUnique(user.username)))
      return { errors: "username.not-unique" };
    return { user: user };
  };

  const signup = async (user, orgId, isAdmin = false) => {
    user.passwordHash = await passwordEncryption.hash(user.password);
    user.organizationId = orgId;
    user.isAdmin = isAdmin;
    user = await repo.signup(user);
    if (user)
      return {
        ok: {
          token: jwtHelper.signToken(user.id, user.username, user.email),
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            isAdmin: user.isAdmin,
          },
        },
      };
  };

  const signin = async (body) => {
    let errors = signinEmptyFields(body);
    if (errors.length) return { errors: errors };
    let { emailOrUsername, password } = body;
    const isEmail = emailOrUsername.includes("@");

    let user;
    if (isEmail) user = await repo.signinWithEmail(emailOrUsername);
    else user = await repo.signinWithUsername(emailOrUsername);
    if (user == null) return { errors: "user.not-found" };
    const passwordHash = user.passwordHash;

    const result = await passwordEncryption.compare(password, passwordHash);
    if (result)
      return {
        ok: {
          token: jwtHelper.signToken(user.id, user.username, user.email),
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            isAdmin: user.isAdmin,
          },
        },
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          isAdmin: user.isAdmin,
        },
      };
    return {
      errors: "password.wrong",
    };
  };

  const update = async (user_id, newInfo) => {
    const updatedUser = await repo.updateUser(user_id, newInfo);
    return { ok: updatedUser };
  };

  const updateToAdmin = async (userId) => {
    const updatedUserToAdmin = await repo.updateUserToAdmin(userId);
    return { ok: updatedUserToAdmin };
  };

  const exists = async (userId) => {
    return await repo.exists(userId);
  };

  return { isSignupValid, signup, signin, update, exists, updateToAdmin };
};
