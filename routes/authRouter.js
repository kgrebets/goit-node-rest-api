import express from "express";
import { registerSchema, loginSchema, emailSchema } from "../schemas/authSchemas.js";
import validateBody from "../helpers/validateBody.js";
import * as authController from "../controllers/authControllers.js";

import { authenticateMiddleware } from "../middlewares/authenticateMiddelware.js";
import { uploadMiddleware } from "../middlewares/uploadMiddelware.js";

export const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), authController.register);

authRouter.get("/verify/:verificationToken", authController.verify);
authRouter.post("/verify", validateBody(emailSchema), authController.requestVerification);

authRouter.post("/login", validateBody(loginSchema), authController.login);
authRouter.get("/current", authenticateMiddleware, authController.getCurrentUser);
authRouter.post("/logout", authenticateMiddleware, authController.logout);
authRouter.patch("/avatars", authenticateMiddleware, uploadMiddleware.single("avatar"), authController.updateAvatar);
