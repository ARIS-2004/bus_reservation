const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/booking");
const paymentRoutes = require("./routes/payment");
const trackingRoutes = require("./routes/tracking");
const feedbackRoutes = require("./routes/feedback");

const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/feedback", feedbackRoutes);

// Serve static files
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
