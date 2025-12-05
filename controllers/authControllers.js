import userService from "../services/userService.js";
import passwordService from "../services/passwordService.js";
import tokenService from "../services/tokenService.js";
import HttpError from "../helpers/HttpError.js";
import path from "node:path";
import fs from "node:fs/promises";
import emailService from "../services/emailService.js";

export const register = async (req, res) => {
  const { password, email } = req.body;

  const existingUser = await userService.getUserByEmail(email);
  if (existingUser) {
    throw HttpError(409, "Email is already in use");
  }

  const hashedPassword = await passwordService.hashPassword(password);

  const newUser = await userService.addUser(hashedPassword, email);

  //verification
  const verificationToken = tokenService.createToken({ email });
  var emailObj = emailService.createVerificationEmail(email, verificationToken);
  emailService.sendEmail(emailObj);
  await userService.updateUser(newUser.id, { verificationToken });

  res.status(201).json({
    id: newUser.id,
    email: newUser.email,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userService.getUserByEmail(email);
  if (!user) throw HttpError(401, "Email or password invalid");
  if (!user.verify) throw HttpError(401, "Email is not verified");

  const passwordCompare = await passwordService.checkPassword(password, user.password);
  if (!passwordCompare) throw HttpError(401, "Email or password invalid");

  const result = await getTokenResult(user);
  return res.status(200).json(result);
};

export const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const { data, error } = tokenService.verifyToken(verificationToken);
  if (error) throw HttpError(401, error.message);

  const user = await userService.getUserByEmailVerificationToken(data.email, verificationToken);
  if (!user) throw HttpError(404, "User not found");
  if (user.verify) throw HttpError(401, "Email already verified");

  await userService.updateUser(user.id, {
    verify: true,
    verificationToken: null,
  });

  res.status(200).json({
    message: "Successfully verify email",
  });
};

export const requestVerification = async (req, res) => {
  const { email } = req.body;
  const user = await userService.getUserByEmail(email);
  if (!user) throw HttpError(401, "User not found");
  if (user.verify) throw HttpError(401, "Email already verified");

  const verificationToken = tokenService.createToken({ email });

  var emailObj = emailService.createVerificationEmail(email, verificationToken);
  emailService.sendEmail(emailObj);

  await userService.updateUser(user.id, { verificationToken });

  res.status(200).json({
    message: "Verify email resend successfully",
  });
};

export const getCurrentUser = async (req, res) => {
  const user = req.user;
  const result = await getTokenResult(user);

  return res.status(200).json(result);
};

export const logout = async (req, res) => {
  const user = req.user;
  await userService.updateUser(user.id, { token: null });

  res.status(204).send();
};

const getTokenResult = async (user) => {
  const payload = { id: user.id };
  const token = tokenService.createToken(payload);

  await userService.updateUser(user.id, { token });

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

  await userService.updateUser(user.id, { avatarURL: avatar });

  res.status(200).send();
};
