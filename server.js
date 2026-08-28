require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const authRoute = require("./routes/authRoutes");
const taskRoute = require("./routes/taskRoutes");
const port = process.env.PORT || 5000;

const envOrigins = [
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGINS,
]
  .filter(Boolean)
  .flatMap((origin) => origin.split(","))
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [
  ...envOrigins,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://mytask-board.vercel.app",
].filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;

  try {
    const { hostname, protocol } = new URL(origin);
    return (
      protocol === "https:" &&
      /^mytask-board(?:-[a-z0-9-]+)*\.vercel\.app$/i.test(hostname)
    );
  } catch {
    return false;
  }
};

// Middleware
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser requests and configured frontend origins.
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  }),
);
app.use(express.json());

// Connect to DB
connectDB();

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

app.use("/api/auth", authRoute);
app.use("/api", taskRoute);


app.use("/auth", authRoute);
app.use("/", taskRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
