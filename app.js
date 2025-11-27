import express from "express";
import morgan from "morgan";
import cors from "cors";
import "express-async-errors";
import sequelize from "./db/sequelize.js";

import contactsRouter from "./routes/contactsRouter.js";
import { authRouter } from "./routes/authRouter.js";

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful");

    // await sequelize.sync({ alter: true });
    // console.log("Models synchronized");

    const app = express();

    app.use(morgan("tiny"));
    app.use(cors());
    app.use(express.json());

    app.use("/api/auth", authRouter);
    app.use("/api/contacts", contactsRouter);

    app.use((_, res) => {
      res.status(404).json({ message: "Route not found" });
    });

    app.use((err, req, res, next) => {
      const { status = 500, message = "Server error" } = err;
      res.status(status).json({ message });
    });

    app.listen(3000, () => {
      console.log("Server is running. Use our API on port: 3000");
    });
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

startServer();
