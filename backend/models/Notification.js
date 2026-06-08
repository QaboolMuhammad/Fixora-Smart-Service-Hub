const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    providerId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "Notification",
    },
    message: {
      type: String,
      default: "",
    },
    bookingId: {
      type: String,
      default: "",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);