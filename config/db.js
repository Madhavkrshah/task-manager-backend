require("dotenv").config();
const mongoose = require("mongoose");

const dbUrl = process.env.MONGO_URI;

async function connectDB() {
  try {
    await mongoose.connect(dbUrl);
    console.log("MongoDB connected sucessfully");
  } catch (err) {
    console.log("MongoDB connection error:", err);
  }
}

module.exports = connectDB;
