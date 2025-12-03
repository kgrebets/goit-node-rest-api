import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

const createToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

const verifyToken = (token) => {
  try {
    const data = jwt.verify(token, JWT_SECRET);
    return { data, error: null };
  } catch (error) {
    return { error, data: null };
  }
};

const tokenService = {
  createToken,
  verifyToken,
};

export default tokenService;
