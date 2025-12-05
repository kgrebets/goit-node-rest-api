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

const getUserByEmailVerificationToken = async (email, verificationToken) => {
  return await User.findOne({ where: { email, verificationToken } });
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

const updateUser = async (userId, updates) => {
  const user = await User.findByPk(userId);
  if (!user) return null;

  const updatedUser = await user.update(updates);
  return updatedUser;
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
  getUserByEmailVerificationToken,
  addUser,
  removeUser,
  updateUser,
  updateStatusContact,
};

export default userService;
