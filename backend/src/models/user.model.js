import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true },
  username: { type: String, required: true, unique: true },
  // Password is separate because Google users won't have one
  password: { type: String },
  // Google ID is separate because Local users won't have one
  googleId: { type: String, unique: true, sparse: true },
  avatar: { type: String, default: "" },
  needsUsernameChange: { type: Boolean, default: false },

  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  verificationCodeExpires: { type: Date },

  createdAt: { type: Date, default: Date.now },
});

// Helper method to check password validity
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Middleware to hash password before saving (only for local users)
userSchema.pre("save", async function () {
  // 1. Remove 'next' param
  if (!this.isModified("password")) return; // 2. Just return if no change

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // 3. No need to call next(), just finish the function
  } catch (err) {
    throw err; // 4. Throw error instead of next(err)
  }
});

export const User = mongoose.model("User", userSchema);
