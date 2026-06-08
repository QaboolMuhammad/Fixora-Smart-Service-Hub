const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title: String,
    category: String,
    price: Number,
    description: String,
    providerName: String,
    city: String,
    image: String,
    providerExperience: String,
    completedJobs: Number,
    earnings: Number,
    rating: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);