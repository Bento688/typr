import passport from "passport";
import { User } from "../models/user.model.js";
import { sendVerificationEmail } from "../lib/email.js";

// POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    // get the data from req body
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or Email already exists" });
    }

    // Generate 6-digit Code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // create new user
    const newUser = new User({
      username,
      email,
      password,
      verificationCode,
      verificationCodeExpires: Date.now() + 15 * 60 * 1000, // 15 mins
      isVerified: false,
    });
    await newUser.save();

    // Send Email
    await sendVerificationEmail(email, verificationCode);

    // Respond OK, but DO NOT log them in yet
    res.status(200).json({
      message: "Verification email sent",
      userId: newUser._id,
      requiresVerification: true,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/verify-email
export const verifyEmail = async (req, res) => {
  try {
    // get the user id and their inserted code from the req body
    const { userId, code } = req.body;

    // find user in the DB
    const user = await User.findById(userId);
    // user not found in database
    if (!user) return res.status(400).json({ message: "User not found" });

    // user already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    // wrong code or timeout
    if (
      user.verificationCode !== code ||
      user.verificationCodeExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    // activate user
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    // Log them in immediately
    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: err.message });
      return res
        .status(200)
        .json({ user, message: "Email verified successfully!" });
    });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
export const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    // if error, return error
    if (err) return next(err);
    // if user not found, return error 400
    if (!user) return res.status(400).json({ message: info.message });

    // if no error, login user
    req.login(user, (err) => {
      // if error return error
      if (err) return next(err);
      // else, return the user object
      return res.json({ user });
    });
  })(req, res, next);
};

// POST /api/auth/logout
export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: "Logged out successfully" });
  });
};

// GET /api/auth/check (For frontend to check if logged in)
export const checkAuth = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }
};

// PUT /api/auth/update-username
export const updateUsername = async (req, res) => {
  try {
    // 1. check if the request is authenticated
    if (!req.isAuthenticated())
      return res.status(401).json({ message: "Not authorized" });

    // 2. get the username from the request body
    const { username } = req.body;

    // 3. Validate length/chars if you want
    if (username.length < 3)
      return res.status(400).json({ message: "Username too short" });

    // 4. Check Uniqueness (exclude current user)
    const existingUser = await User.findOne({ username });
    if (
      existingUser &&
      existingUser._id.toString() !== req.user._id.toString()
    ) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // 5. Update User
    const user = await User.findById(req.user._id);
    user.username = username;
    user.needsUsernameChange = false; // [!code ++] Turn off the flag
    await user.save();

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
