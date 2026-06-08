const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customerName: String,
    contactNumber: String,
    city: String,
    address: String,

    serviceTitle: String,
    serviceImage: String,
    price: Number,

    providerId: { type: String, default: "" },
    providerName: { type: String, default: "Not Assigned" },

    paymentMethod: { type: String, default: "Cash" },
    paymentStatus: { type: String, default: "Pending" },

    status: { type: String, default: "Pending Admin Approval" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);