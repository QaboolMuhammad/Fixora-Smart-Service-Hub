const express = require("express");
const Booking = require("../models/Booking");
const Notification = require("../models/Notification");
const User = require("../models/User");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const booking = await Booking.create({
      ...req.body,
      status: "Pending Admin Approval",
      providerId: "",
      providerName: "Not Assigned",
      paymentStatus: req.body.paymentMethod === "Online" ? "Paid" : "Pending",
    });

    res.status(201).json({
      message: "Booking sent to admin for approval",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/provider/:providerId", async (req, res) => {
  try {
    const bookings = await Booking.find({
      providerId: req.params.providerId,
    }).sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id/assign", async (req, res) => {
  try {
    const { providerId } = req.body;

    const provider = await User.findById(providerId);

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    if (provider.providerStatus === "busy") {
      return res.status(400).json({ message: "Provider is currently busy" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        providerId: provider._id,
        providerName: provider.fullName,
        status: "Assigned to Provider",
      },
      { new: true }
    );

    await User.findByIdAndUpdate(providerId, {
      providerStatus: "busy",
    });

    await Notification.create({
      providerId,
      title: "New Job Assigned",
      message: `Admin assigned you ${booking.serviceTitle}. Customer: ${booking.customerName}, Contact: ${booking.contactNumber}, Address: ${booking.address}`,
      bookingId: booking._id,
    });

    res.json({
      message: "Provider assigned successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id/complete", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status: "Completed",
        paymentStatus: "Paid",
      },
      { new: true }
    );

    await User.findByIdAndUpdate(booking.providerId, {
      providerStatus: "free",
      $inc: {
        completedJobs: 1,
        earnings: Number(booking.price) || 0,
      },
    });

    res.json({
      message: "Job completed successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;