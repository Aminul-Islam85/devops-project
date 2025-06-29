const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profilePic: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["worker", "buyer", "admin"],
    default: "worker",
  },
  coins: {
    type: Number,
    default: 0,
  },
  lastLogin: {
  type: Date,
  default: Date.now
},

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
