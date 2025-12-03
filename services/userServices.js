import { User } from "../db/model/user.js";

export const listUsers = async () => {
  const users = await User.findAll();
  return users;
};

export const getUserById = async (userId) => {
  return await User.findByPk(userId);
};

export const getUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

export const addUser = async (password, email, subscription, token) => {
  const newUser = await User.create({
    password,
    email,
    subscription,
    token,
  });

  return newUser;
};

export const removeUser = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    return null;
  }

  await user.destroy();
  return user;
};

export const updateUser = async (
  userId,
  password,
  email,
  subscription,
  token
) => {
  const user = await User.findByPk(userId);

  if (!user) {
    return null;
  }

  if (password !== undefined) user.password = password;
  if (email !== undefined) user.email = email;
  if (subscription !== undefined) user.subscription = subscription;
  if (token !== undefined) user.token = token;

  await user.save();
  return user;
};

export const updateStatusContact = async (contactId, favorite) => {
  const contact = await Contact.findByPk(contactId);
  if (!contact) {
    throw new Error(`Contact id: ${contactId} not existed`);
  }

  contact.favorite = favorite;
  await contact.save();

  return contact;
};
