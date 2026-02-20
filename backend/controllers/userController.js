import { response } from "express";
import userModel from "../models/userModel.js";
import validator from "validator";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import qs from "qs";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
import { sendEmail, emailTemplates } from "../config/email.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }
    const isMatch = await bycrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Checking user already exists or not
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Validating email format &  strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email address",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // Hashing password
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email == process.env.ADMIN_EMAIL &&
      password == process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ email: email }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const profileUser = async (req, res) => {
  try {
    const userId = req.userId || req.body?.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - No user ID" });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.userId || req.body?.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - No user ID" });
    }

    const { name, phone, address } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    // Xử lý upload avatar nếu có
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
        folder: "avatars",
      });
      updateData.avatar = result.secure_url;
    }

    const user = await userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Cập nhật thông tin thành công", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const facebooklogin = async (req, res) => {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const redirectUri = `${backendUrl}/api/user/auth/facebook/callback`;
  const clientId = process.env.FACEBOOK_APP_ID;
  const url = `https://www.facebook.com/v10.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=email`;
  res.redirect(url);
};

const facebookcallback = async (req, res) => {
  const code = req.query.code;
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const redirectUri = `${backendUrl}/api/user/auth/facebook/callback`;
  try {
    const tokenRes = await axios.get(
      "https://graph.facebook.com/v10.0/oauth/access_token",
      {
        params: {
          client_id: process.env.FB_CLIENT_ID,
          client_secret: process.env.FB_CLIENT_SECRET,
          redirect_uri: redirectUri,
          code: req.query.code,
        },
        timeout: 10000,
      },
    );
    const access_token = tokenRes.data.access_token;
    const profileRes = await axios.get("https://graph.facebook.com/me", {
      params: { fields: "id,name,email" },
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const { email, name } = profileRes.data;

    let user = await userModel.findOne({ email });
    if (!user) {
      // Nếu chưa có user thì tạo mới
      user = await userModel.create({
        email,
        name,
        password: null,
        authProvider: "facebook",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.redirect(`${frontendUrl}/success?token=${token}`);
  } catch (error) {
    console.error("Error fetching Facebook user info:", error);
    res.redirect(`${frontendUrl}/login?error=auth_failed`);
  }
};
const googleLogin = (req, res) => {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const redirectUri = `${backendUrl}/api/user/auth/google/callback`;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile&access_type=online&prompt=consent`;
  res.redirect(url);
};

const googleCallback = async (req, res) => {
  const code = req.query.code;
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const redirectUri = `${backendUrl}/api/user/auth/google/callback`;

  // Kiểm tra nếu có error từ Google
  if (req.query.error) {
    console.error("Google OAuth error:", req.query.error);
    return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
  }

  // Kiểm tra có code không
  if (!code) {
    console.error("No authorization code received");
    return res.redirect(`${frontendUrl}/login?error=no_code`);
  }

  try {
    // Exchange code for access token
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      qs.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 10000,
      },
    );
    const accessToken = tokenRes.data.access_token;

    // Get user profile
    const profileRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 10000,
      },
    );
    const { email, name, given_name, family_name } = profileRes.data;

    // Kiểm tra có email không
    if (!email) {
      console.error("No email received from Google");
      return res.redirect(`${frontendUrl}/login?error=no_email`);
    }

    // Tạo tên đầy đủ nếu name không có
    const fullName =
      name || `${given_name || ""} ${family_name || ""}`.trim() || "User";

    // Tìm hoặc tạo user
    let user = await userModel.findOne({ email });
    if (!user) {
      // Nếu chưa có user thì tạo mới
      user = await userModel.create({
        email,
        name: fullName,
        password: null,
        authProvider: "google",
      });
    }

    // Tạo JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.redirect(`${frontendUrl}/success?token=${token}`);
  } catch (error) {
    console.error(
      "Error in Google OAuth callback:",
      error.response?.data || error.message,
    );
    res.redirect(`${frontendUrl}/login?error=auth_failed`);
  }
};

// Send verification email
const sendVerificationEmail = async (req, res) => {
  try {
    const userId = req.userId || req.body?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.json({ success: false, message: "Email đã được xác thực" });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = tokenExpiry;
    await user.save();

    // Send email
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;
    
    const emailResult = await sendEmail(
      user.email,
      "Xác thực email - Vườn Lá Nhỏ",
      emailTemplates.verifyEmail(verificationLink, user.name)
    );

    if (emailResult.success) {
      res.json({ success: true, message: "Email xác thực đã được gửi. Vui lòng kiểm tra hộp thư." });
    } else {
      res.json({ success: false, message: "Không thể gửi email. Vui lòng thử lại." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify email with token
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.json({ success: false, message: "Token không hợp lệ" });
    }

    const user = await userModel.findOne({ 
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    res.json({ success: true, message: "Email đã được xác thực thành công!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Forgot password - send reset link
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Vui lòng nhập email" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Email không tồn tại trong hệ thống" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = tokenExpiry;
    await user.save();

    // Send email
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;
    
    const emailResult = await sendEmail(
      user.email,
      "Đặt lại mật khẩu - Vườn Lá Nhỏ",
      emailTemplates.resetPassword(resetLink, user.name)
    );

    if (emailResult.success) {
      res.json({ success: true, message: "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư." });
    } else {
      res.json({ success: false, message: "Không thể gửi email. Vui lòng thử lại." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reset password with token
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.json({ success: false, message: "Thiếu thông tin" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Mật khẩu phải có ít nhất 8 ký tự" });
    }

    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    // Hash new password
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    // Send confirmation email
    await sendEmail(
      user.email,
      "Mật khẩu đã được thay đổi - Vườn Lá Nhỏ",
      emailTemplates.passwordChanged(user.name)
    );

    res.json({ success: true, message: "Mật khẩu đã được đặt lại thành công!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  loginUser,
  updateProfile,
  profileUser,
  registerUser,
  adminLogin,
  facebooklogin,
  facebookcallback,
  googleLogin,
  googleCallback,
  sendVerificationEmail,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
