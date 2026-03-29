require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const authRoute = require("./routes/authRoutes");
const taskRoute = require("./routes/taskRoutes");
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

app.use("/api/auth", authRoute);
app.use("/api", taskRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});