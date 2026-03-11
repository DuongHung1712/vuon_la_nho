import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

const authUser = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({ success: false, message: "Not Authorized Login Again" });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = token_decode.id;
    if (!req.body) {
      req.body = {};
    }
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    logger.warn("Auth token verification failed", { error: error.message });
    res.json({ success: false, message: "Authentication failed" });
  }
};

export default authUser;
