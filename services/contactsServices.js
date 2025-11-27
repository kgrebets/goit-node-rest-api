import { Contact } from "../db/model/contact.js";

export const listContacts = async ( owner, skip, limit, favorite ) => {
  const where = { owner };

  if (favorite !== undefined) {
    where.favorite = favorite ; 
  }

  const { rows: contacts, count: total } = await Contact.findAndCountAll({
    where,
    offset: skip,
    limit: limit,
  });

  return { contacts, total };
};

export const getContactById = async (contactId, owner) => {
  return await Contact.findOne({
    where: { id: contactId, owner },
  });
};

export const addContact = async (name, email, phone, owner) => {
  const newContact = await Contact.create({
    name,
    email,
    phone,
    owner,
  });

  return newContact;
};

export const removeContact = async (contactId, owner) => {
  const contact = await Contact.findOne({
    where: { id: contactId, owner },
  });

  if (!contact) {
    return null;
  }

  await contact.destroy();
  return contact;
};

export const updateContact = async (
  contactId,
  name,
  email,
  phone,
  favorite,
  owner
) => {
  const contact = await Contact.findOne({
    where: { id: contactId, owner },
  });

  if (!contact) {
    return null;
  }

  if (name !== undefined) contact.name = name;
  if (email !== undefined) contact.email = email;
  if (phone !== undefined) contact.phone = phone;
  if (favorite !== undefined) contact.favorite = favorite;

  await contact.save();
  return contact;
};

export const updateStatusContact = async (contactId, favorite, owner) => {
  const contact = await Contact.findOne({
    where: { id: contactId, owner },
  });
  if (!contact) {
    throw new Error(`Contact id: ${contactId} not existed`);
  }

  contact.favorite = favorite;
  await contact.save();

  return contact;
};
