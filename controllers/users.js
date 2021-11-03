import generateToken from "../helpers/token";
import { comparePassword, hashPassword } from "../helpers/encryptPassword";
import {
  isEmailUnique,
  isUsernameUnique,
  createUser,
  loginUser,
} from "../models/users";

const minUsernameLength = 3;
const maxUsernameLength = 25;
const minPasswordLength = 8;
const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i;
const specialCharacters = /[ `!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?~]/;

const signupEmptyFields = ({
  username,
  email,
  password,
  firstName,
  lastName,
}) => {
  let errors = [];
  if (!firstName) errors.push("firstName.empty");
  if (!lastName) errors.push("lastName.empty");
  if (!password) errors.push("password.empty");
  if (!username) errors.push("username.empty");
  if (!email) errors.push("email.empty");
  return errors;
};

const signupFieldValidation = async (username, email, password) => {
  let errors = [];
  if (username.length < minUsernameLength) errors.push("username.short");
  if (username.length > maxUsernameLength) errors.push("username.long");
  if (specialCharacters.test(username))
    errors.push("username.invalid-character");
  if (emailRegex.test(email)) errors.push("email.invalid");
  if (password.length < minPasswordLength) errors.push("password.short");
  if (!errors.length && !(await isEmailUnique(email)))
    errors.push("email.not-unique");
  if (!errors.length && !(await isUsernameUnique(username)))
    errors.push("username.not-unique");
  return errors;
};

const signupFieldFormatting = ({ username, email, firstName, lastName }) => {
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
  };
};

export const signup = async (body_params) => {
  const { password } = body_params;
  let errors = signupEmptyFields(body_params);
  if (errors.length) return { error: errors };
  const { username, email, firstName, lastName } =
    signupFieldFormatting(body_params);
  errors = await signupFieldValidation(username, email, password);
  if (errors.length) return { error: errors };

  const passwordHash = await hashPassword(password);
  const user = await createUser(
    firstName,
    lastName,
    email,
    username,
    passwordHash
  );
  return { ok: { token: generateToken(user.id, user.username, user.email) } };
};

const signinEmptyFields = ({ emailOrUsername, password }) => {
  let errors = [];
  if (!password) errors.push("password.empty");
  if (!emailOrUsername) {
    errors.push("email-username.not-found");
  }
  return errors;
};

export const signin = async (body_params) => {
  let { emailOrUsername, password } = body_params;

  const errors = signinEmptyFields(body_params);
  if (errors.length) return { error: errors };

  emailOrUsername = emailOrUsername.toLowerCase();
  const isEmail = emailOrUsername.includes("@");
  const user = await loginUser(emailOrUsername, isEmail);
  if (!user) return { error: "email-username.not-found" };
  if (await comparePassword(password, user.passwordHash))
    return { ok: { token: generateToken(user.id, user.username, user.email) } };
  return { error: "password.invalid" };
};
