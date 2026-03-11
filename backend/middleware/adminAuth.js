import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    if (token_decode.email !== process.env.ADMIN_EMAIL) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }
    next();
  } catch (error) {
    logger.warn("Admin auth failed", { error: error.message });
    return res.json({ success: false, message: "Authentication failed" });
  }
};
export default adminAuth;
