import HttpError from "../helpers/HttpError.js";
import * as userService from "../services/userServices.js";
import * as tokenService from "../services/tokenService.js";

export const authenticateMiddleware = async (req, res, next) => {
  const authorization = req.get("Authorization");
  if (!authorization) throw HttpError(401, "Authoriaztion header missing");

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer")
    throw HttpError(401, "Authorization header must have Bearer type");

  const { data, error } = tokenService.verifyToken(token);
  if (error) throw HttpError(401, "Not authorized"); //error.message

  const user = await userService.getUserById(data.id);
  if (!user) throw HttpError(401, "User not found");

  if (!user.token) throw HttpError(401, "User already logout");

  req.user = user;
  next();
};
