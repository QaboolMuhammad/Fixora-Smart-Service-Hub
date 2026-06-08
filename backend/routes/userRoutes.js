const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.get("/providers", async (req, res) => {
  try {
    const { city } = req.query;

    const providers = await User.find({
      role: "provider",
      ...(city && { city }),
    }).select("-password");

    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id/status", async (req, res) => {
  try {
    const provider = await User.findByIdAndUpdate(
      req.params.id,
      { providerStatus: req.body.providerStatus },
      { new: true }
    ).select("-password");

    res.json({
      message: "Status updated successfully",
      provider,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id/profile", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/providers/:id/rating", async (req, res) => {
  try {
    const provider = await User.findByIdAndUpdate(
      req.params.id,
      { rating: req.body.rating },
      { new: true }
    ).select("-password");

    res.json({
      message: "Rating updated",
      provider,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;