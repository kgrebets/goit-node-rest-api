import express from "express";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";
import validateBody from "../helpers/validateBody.js";
import * as authController from "../controllers/authControllers.js";

import { authenticateMiddleware } from "../middlewares/authenticateMiddelware.js";

export const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), authController.register);
authRouter.post("/login", validateBody(loginSchema), authController.login);
authRouter.get("/current", authenticateMiddleware, authController.getCurrentUser);
authRouter.post("/logout", authenticateMiddleware, authController.logout);