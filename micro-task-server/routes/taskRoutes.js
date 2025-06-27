const express = require("express");
const router = express.Router();
const Submission = require("../models/Submission");
const Task = require("../models/Task");
const User = require("../models/User");
const WithdrawRequest = require("../models/WithdrawRequest");
const Notification = require("../models/Notification");
const Testimonial = require("../models/Testimonial");


// ✅ POST /api/tasks/add
router.post("/add", async (req, res) => {
  try {
    const {
      task_title,
      task_detail,
      required_workers,
      payable_amount,
      completion_date,
      submission_info,
      task_image_url,
      buyer_email,
    } = req.body;

    const total_payable = required_workers * payable_amount;

    const buyer = await User.findOne({ email: buyer_email });

    if (!buyer || buyer.role !== "buyer") {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    if (buyer.coins < total_payable) {
      return res.status(400).json({
        message: "Not enough coins. Please purchase more.",
        redirect: "/dashboard/payments",
      });
    }

    // Deduct coins
    buyer.coins -= total_payable;
    await buyer.save();

    // Create task
    const task = new Task({
      task_title,
      task_detail,
      required_workers,
      payable_amount,
      total_payable,
      completion_date,
      submission_info,
      task_image_url,
      buyer_email: buyer.email,
      buyer_name: buyer.name,
      buyer_id: buyer._id,
    });

    await task.save();

    res.status(201).json({ message: "Task created successfully", task });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


router.get("/my", async (req, res) => {
  try {
    const email = req.query.email;
    const tasks = await Task.find({ buyer_email: email }).sort({ created_at: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to load tasks", error: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    
    const buyer = await User.findOne({ email: task.buyer_email });
    if (buyer) {
      buyer.coins += task.total_payable; // refund the locked coins
      await buyer.save();
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted and coins refunded." });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task", error: err.message });
  }
});



router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task updated successfully", task: updatedTask });
  } catch (err) {
    res.status(500).json({ message: "Failed to update task", error: err.message });
  }
});


router.get("/available", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks", error: err.message });
  }
});


router.post("/submissions", async (req, res) => {
  try {
    const { task_id, worker_email, worker_name, proof } = req.body;

    const task = await Task.findById(task_id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const submission = new Submission({
      task_id,
      task_title: task.task_title,
      buyer_email: task.buyer_email,
      worker_email,
      worker_name,
      proof,
      status: "pending",
    });

    await submission.save();
    await Notification.create({
      userEmail: worker_email,
      message: `You submitted proof for task: \"${task.task_title}\"`,
    });
    await Notification.create({
      userEmail: task.buyer_email,
      message: `New submission received for task: \"${task.task_title}\"`,
    });

    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      await Notification.create({
        userEmail: admin.email,
        message: `New submission by ${worker_name} for task: "${task.task_title}"`,
      });
    }


    res.status(201).json({ message: "Submission successful", submission });
  } catch (err) {
    res.status(500).json({ message: "Submission failed", error: err.message });
  }
});


router.get("/submissions/worker/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const submissions = await Submission.find({ worker_email: email }).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch submissions", error: err.message });
  }
});


router.get("/submissions/task/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const submissions = await Submission.find({ task_id: taskId }).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: "Failed to load submissions", error: err.message });
  }
});


router.put("/submissions/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

   
    if (submission.status === "approved" || submission.status === "rejected") {
      return res.status(400).json({ message: "Submission already processed." });
    }

    
    submission.status = status;
    await submission.save();
    await Notification.create({
        userEmail: submission.worker_email,
        message: `Your submission for "${submission.task_title}" was ${status}`,
    });


    if (status === "approved") {
      const task = await Task.findById(submission.task_id);
      if (!task) return res.status(404).json({ message: "Task not found" });

      const worker = await User.findOne({ email: submission.worker_email });
      if (!worker) return res.status(404).json({ message: "Worker not found" });

      worker.coins += task.payable_amount;
      await worker.save();
    }

    res.json({ message: "Submission status updated", submission });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status", error: err.message });
  }
});


router.post("/withdraw", async (req, res) => {
  try {
    const { email, amount, method } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.role !== "worker") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (user.coins < amount) {
      return res.status(400).json({ message: "Not enough coins to withdraw." });
    }

    
    user.coins -= amount;
    await user.save();

    
    const request = new WithdrawRequest({ email, amount, method });
    await request.save();

    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      await Notification.create({
        userEmail: admin.email,
        message: `New withdrawal request from ${email} for ${amount} coins.`,
      });
    }

    res.status(201).json({ message: "Withdrawal request submitted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit request", error: err.message });
  }
});


router.post("/purchase", async (req, res) => {
  try {
    const { email, coins } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.role !== "buyer") {
      return res.status(403).json({ message: "Only buyers can purchase coins." });
    }

    user.coins += coins;
    await user.save();

    res.json({ message: `Successfully purchased ${coins} coins.` });
  } catch (err) {
    res.status(500).json({ message: "Purchase failed", error: err.message });
  }
});


router.get("/withdraw-requests", async (req, res) => {
  try {
    const requests = await WithdrawRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch requests", error: err.message });
  }
});


router.delete("/withdraw-requests/:id", async (req, res) => {
  try {
    await WithdrawRequest.findByIdAndDelete(req.params.id);
    res.json({ message: "Request removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete request", error: err.message });
  }
});


router.get("/all-submissions", async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch submissions", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task", error: err.message });
  }
});


router.post("/withdraw-requests/approve", async (req, res) => {
  try {
    const { email, amount, method } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove request (we assume coins already deducted when worker submitted)
    await WithdrawRequest.findOneAndDelete({ email, amount, method });

    res.json({ message: "Withdrawal approved and finalized." });
  } catch (err) {
    res.status(500).json({ message: "Approval failed", error: err.message });
  }
});


router.get("/admin/stats", async (req, res) => {
  try {
    const [userCount, taskCount, submissionCount, withdrawCount] = await Promise.all([
      User.countDocuments(),
      Task.countDocuments(),
      Submission.countDocuments(),
      WithdrawRequest.countDocuments({ status: "pending" }),
    ]);

    const pendingSubmissions = await Submission.countDocuments({ status: "pending" });
    const totalCoins = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$coins" } } }
    ]);

    res.json({
      users: userCount,
      tasks: taskCount,
      submissions: submissionCount,
      pendingWithdraws: withdrawCount,
      pendingSubmissions,
      totalCoins: totalCoins[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats", error: err.message });
  }
});

router.get("/submission-changes/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const changedSubmissions = await Submission.find({
      worker_email: email,
      updatedAt: { $gt: user.lastLogin },  // only fetch those updated after last login
      status: { $in: ["approved", "rejected"] }
    });

    res.json(changedSubmissions);
  } catch (err) {
    res.status(500).json({ message: "Error checking submission changes", error: err.message });
  }
});

router.get("/notifications/:email", async (req, res) => {
  try {
    const notifications = await Notification.find({ userEmail: req.params.email }).sort({ createdAt: -1 }).limit(20);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications", error: err.message });
  }
});


router.post("/notifications/clear/:email", async (req, res) => {
  try {
    await Notification.deleteMany({ userEmail: req.params.email });
    res.json({ message: "Notifications cleared" });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear notifications", error: err.message });
  }
});


router.get("/top-workers", async (req, res) => {
  try {
    const workers = await User.find({ role: "worker" })
      .sort({ coins: -1 })
      .limit(6)
      .select("name email coins profilePic");

    res.json(workers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch top workers", error: err.message });
  }
});

router.get("/testimonials", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().limit(6);
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch testimonials", error: err.message });
  }
});


router.post("/testimonials", async (req, res) => {
  try {
    const { name, message, avatar, role } = req.body;

    if (!name || !message) {
      return res.status(400).json({ message: "Name and message are required." });
    }

    const testimonial = new Testimonial({ name, message, avatar, role });
    await testimonial.save();

    res.status(201).json({ message: "Testimonial submitted", testimonial });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit testimonial", error: err.message });
  }
});




module.exports = router;
