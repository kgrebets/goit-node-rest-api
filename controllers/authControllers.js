import userService from "../services/userService.js";
import passwordService from "../services/passwordService.js";
import tokenService from "../services/tokenService.js";
import HttpError from "../helpers/HttpError.js";
import path from "node:path";
import fs from "node:fs/promises";

export const register = async (req, res) => {
  const { password, email } = req.body;

  const existingUser = await userService.getUserByEmail(email);
  if (existingUser) {
    throw HttpError(409, "Email is already in use");
  }

  const hashedPassword = await passwordService.hashPassword(password);

  const newUser = await userService.addUser(hashedPassword, email);

  res.status(201).json({
    id: newUser.id,
    email: newUser.email,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userService.getUserByEmail(email);
  if (!user) throw HttpError(401, "Email or password invalid");

  const passwordCompare = await passwordService.checkPassword(
    password,
    user.password
  );
  if (!passwordCompare) throw HttpError(401, "Email or password invalid");

  const result = await getTokenResult(user);
  return res.status(200).json(result);
};

export const getCurrentUser = async (req, res) => {
  const user = req.user;
  const result = await getTokenResult(user);

  return res.status(200).json(result);
};

export const logout = async (req, res) => {
  const user = req.user;
  await userService.updateUser(
    user.id,
    undefined,
    undefined,
    undefined,
    null,
    undefined
  );

  res.status(204).send();
};

const getTokenResult = async (user) => {
  const payload = { id: user.id };
  const token = tokenService.createToken(payload);

  await userService.updateUser(
    user.id,
    undefined,
    undefined,
    undefined,
    token,
    undefined
  );

  return {
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    },
  };
};

export const updateAvatar = async (req, res) => {
  const user = req.user;
  const file = req.file;

  let avatar = null;
  if (file) {
    const avatarsDir = path.resolve("public", "avatars");
    const newPath = path.join(avatarsDir, file.filename);
    await fs.rename(file.path, newPath);
    avatar = path.join("avatars", file.filename);
  }

  console.log("Avatar updated:", avatar);
  await userService.updateUser(
    user.id,
    undefined,
    undefined,
    undefined,
    undefined,
    avatar
  );

  res.status(200).send();
};
