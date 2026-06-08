const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: { type: String, required: true, unique: true },
    password: String,

    role: {
      type: String,
      enum: ["customer", "provider", "admin"],
      default: "customer",
    },

    phone: String,
    city: String,
    address: String,

    providerStatus: {
      type: String,
      enum: ["free", "busy"],
      default: "free",
    },

    experience: String,
    skills: [String],
    completedJobs: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);