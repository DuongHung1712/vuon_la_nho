import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true, sparse: true },
    password: { type: String, required: false },
    avatar: { type: String, required: false },
    phone: { type: String, required: false },
    address: { type: String, default: "" },
    cartData: { type: Object, default: {} },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpiry: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpiry: { type: Date },
  },
  { minimize: false },
);

const userModel = mongoose.models.user || mongoose.model("users", userSchema);

export default userModel;
