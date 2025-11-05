import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Helper: Validate username (alphanumeric + @._- allowed, 3-20 chars)
const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9@._-]{3,20}$/;
  return usernameRegex.test(username);
};

// Helper: Validate password (min 6 chars, at least 1 letter, 1 number)
const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
};

// REGISTER ROUTE
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // 1. Basic presence check
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  // 2. Trim whitespace
  const trimmedUsername = username.trim();
  const trimmedPassword = password;

  // 3. Format validation
  if (!isValidUsername(trimmedUsername)) {
    return res
      .status(400)
      .json({ error: "Username must be 3-20 chars, letters, numbers, @._- only" });
  }

  if (!isValidPassword(trimmedPassword)) {
    return res
      .status(400)
      .json({ error: "Password must be 6+ chars with at least 1 letter and 1 number" });
  }

  try {
    // 4. Check if user exists
    const existingUser = await User.findOne({ username: trimmedUsername });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // 5. Hash password
    const hashedPassword = await bcrypt.hash(trimmedPassword, 12);

    // 6. Create user
    const user = new User({
      username: trimmedUsername,
      password: hashedPassword,
    });
    await user.save();

    // 7. Success response
    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    // 8. Handle MongoDB duplicate key
    if (err.code === 11000) {
      return res.status(400).json({ error: "Username already exists" });
    }

    console.error("Register error:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // 1. Basic presence
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const trimmedUsername = username.trim();

  try {
    // 2. Find user
    const user = await User.findOne({ username: trimmedUsername });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // 4. Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || "fallback-secret-for-dev-only",
      { expiresIn: "7d" }
    );

    // 5. Success response
    res.json({
      token,
      username: user.username,
      message: "Login successful",
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

export default router;