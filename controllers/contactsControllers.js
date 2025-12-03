import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  const owner = req.user.id;

  const { page = 1, limit = 5, favorite } = req.query;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skipNum = (pageNum - 1) * limitNum;
  const favoriteBool = favorite ? favorite === "true" : undefined;

  const { contacts, total } = await contactsService.listContacts(
    owner,
    skipNum,
    limitNum,
    favoriteBool
  );

  res.status(200).json({
    page: pageNum,
    limit: limitNum,
    total,
    contacts,
  });
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const owner = req.user.id;

  const contact = await contactsService.getContactById(id, owner);

  if (!contact) {
    throw HttpError(404);
  }

  res.status(200).json(contact);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const owner = req.user.id;
  const deleted = await contactsService.removeContact(id, owner);

  if (!deleted) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(deleted);
};

export const createContact = async (req, res) => {
  const { name, email, phone } = req.body;
  const owner = req.user.id;
  const newContact = await contactsService.addContact(
    name,
    email,
    phone,
    owner
  );
  res.status(201).json(newContact);
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const owner = req.user.id;

  const updatedContact = await contactsService.updateContact(
    id,
    body.name,
    body.email,
    body.phone,
    undefined,
    owner
  );

  if (!updatedContact) {
    throw HttpError(404);
  }
  res.status(200).json(updatedContact);
};

export const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;
  const owner = req.user.id;

  if (favorite === undefined) {
    throw HttpError(400, "Not valid favorite");
  }

  const contact = await contactsService.getContactById(id, owner);
  if (!contact) {
    throw HttpError(404);
  }

  const updatedContact = await contactsService.updateStatusContact(
    id,
    favorite,
    owner
  );

  res.status(200).json(updatedContact);
};
