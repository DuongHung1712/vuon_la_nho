import express from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import {
  loginUser,
  registerUser,
  adminLogin,
  facebooklogin,
  googleCallback,
  facebookcallback,
  googleLogin,
  profileUser,
  updateProfile,
  sendVerificationEmail,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getSessionToken,
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.get("/session", getSessionToken); // Get token from HTTP-only cookie
userRouter.get("/auth/facebook", facebooklogin);
userRouter.get("/auth/facebook/callback", facebookcallback);
userRouter.get("/auth/google", googleLogin);
userRouter.get("/auth/google/callback", googleCallback);
userRouter.get("/profile", authUser, profileUser);
userRouter.put("/profile", authUser, upload.single("avatar"), updateProfile);

userRouter.post("/send-verification", authUser, sendVerificationEmail);
userRouter.post("/verify-email", verifyEmail);

userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);

export default userRouter;
