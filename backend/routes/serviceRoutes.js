const express = require("express");
const Service = require("../models/Service");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { city } = req.query;
    const filter = city ? { city } : {};
    const services = await Service.find(filter).sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/seed", async (req, res) => {
  try {
    await Service.deleteMany();

    const services = await Service.insertMany([
      {
        title: "Electrician Service",
        category: "Electrical",
        price: 1200,
        city: "Karachi",
        description: "Fan, switch, wiring and light repair service.",
        providerName: "Ali Electric Works",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e",
        providerExperience: "5 years experience in home electrical repair.",
        completedJobs: 230,
        earnings: 340000,
        rating: 4.8
      },
      {
        title: "AC Repair",
        category: "Cooling",
        price: 2500,
        city: "Karachi",
        description: "AC service, gas refill and cooling issue repair.",
        providerName: "Cool Air Experts",
        image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4",
        providerExperience: "Expert in split AC and inverter AC repairing.",
        completedJobs: 180,
        earnings: 510000,
        rating: 4.7
      },
      {
        title: "Plumber Service",
        category: "Plumbing",
        price: 1000,
        city: "Islamabad",
        description: "Pipe leakage, tap repair and bathroom fitting.",
        providerName: "Quick Plumbers",
        image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39",
        providerExperience: "Professional plumbing work for homes and offices.",
        completedJobs: 145,
        earnings: 280000,
        rating: 4.6
      },
      {
        title: "Home Cleaning",
        category: "Cleaning",
        price: 1800,
        city: "Islamabad",
        description: "Room, kitchen and complete house cleaning service.",
        providerName: "CleanPro Team",
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
        providerExperience: "Deep cleaning, sofa cleaning and house care.",
        completedJobs: 300,
        earnings: 620000,
        rating: 4.9
      }
    ]);

    res.json({ message: "Services added successfully", services });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;