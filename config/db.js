require("dotenv").config();
const mongoose = require("mongoose");

const dbUrl =
  process.env.MONGO_URI ||
  "mongodb+srv://task_manager:a7omH88hz4QW1Nis@cluster0.7tjtunz.mongodb.net/";

async function connectDB() {
  try {
    await mongoose.connect(dbUrl);
    console.log("MongoDB connected sucessfully");
  } catch (err) {
    console.log("MongoDB connection error:", err);
  }
}

module.export = { connectDB };
