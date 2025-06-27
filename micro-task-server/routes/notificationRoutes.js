const express = require("express");
const Notification = require("../models/Notification");
const router = express.Router();


router.get("/:email", async (req, res) => {
  try {
    const notifications = await Notification.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications", error: err.message });
  }
});


router.put("/:id/read", async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark as read", error: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete notification", error: err.message });
  }
});

module.exports = router;
