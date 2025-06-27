const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();


const JWT_SECRET = process.env.JWT_SECRET;


router.post("/register", async (req, res) => {
  try {
    const { name, email, profilePic, password, role } = req.body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const defaultCoins = role === "worker" ? 10 : 50;

    const newUser = new User({
      name,
      email,
      profilePic,
      password: hashedPassword,
      role,
      coins: defaultCoins,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ token, user: { name, email, role, profilePic, coins: newUser.coins } });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    const { name, role, profilePic, coins } = user;
    res.json({ token, user: { name, email, role, profilePic, coins } });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});


router.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
});


router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
});



router.put("/users/:id/role", async (req, res) => {
  try {
    const { role } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    res.json({ message: "Role updated", user: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update role", error: err.message });
  }
});



router.get("/user/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
});


module.exports = router;
