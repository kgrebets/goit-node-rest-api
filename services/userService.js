import gravatar from "gravatar";
import { User } from "../db/model/user.js";

const listUsers = async () => {
  const users = await User.findAll();
  return users;
};

const getUserById = async (userId) => {
  return await User.findByPk(userId);
};

const getUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

const addUser = async (password, email, subscription, token) => {
  const avatarURL = gravatar.url(email, { s: "250", d: "mp" }, true);

  const newUser = await User.create({
    password,
    email,
    subscription,
    token,
    avatarURL,
  });

  return newUser;
};

const removeUser = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    return null;
  }

  await user.destroy();
  return user;
};

const updateUser = async (
  userId,
  password,
  email,
  subscription,
  token,
  avatarURL
) => {
  const user = await User.findByPk(userId);

  if (!user) {
    return null;
  }

  if (password !== undefined) user.password = password;
  if (email !== undefined) user.email = email;
  if (subscription !== undefined) user.subscription = subscription;
  if (token !== undefined) user.token = token;
  if (avatarURL !== undefined) user.avatarURL = avatarURL;

  await user.save();
  return user;
};

const updateStatusContact = async (contactId, favorite) => {
  const contact = await Contact.findByPk(contactId);
  if (!contact) {
    throw new Error(`Contact id: ${contactId} not existed`);
  }

  contact.favorite = favorite;
  await contact.save();

  return contact;
};

const userService = {
  listUsers,
  getUserById,
  getUserByEmail,
  addUser,
  removeUser,
  updateUser,
  updateStatusContact,
};

export default userService;
