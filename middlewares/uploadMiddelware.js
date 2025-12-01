import multer from "multer";
import path from "node:path";

import HttpError from "../helpers/HttpError.js";

const tempDir = path.resolve("temp");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniquePreffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePreffix}_${file.originalname}`;
    cb(null, filename);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, cb) => {
  const extenstion = file.originalname.split(".").pop();
  if (extenstion === "exe") {
    return cb(HttpError(400, ".exe extension not allow"));
  }
  cb(null, true);
};

export const uploadMiddleware = multer({
  storage,
  limits,
  fileFilter,
});
