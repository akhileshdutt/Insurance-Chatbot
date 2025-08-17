const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import the authentication routes from the routes directory.
const authRoutes = require('./routes/authRoute');
const chatbotRoutes = require('./routes/chatbotRoutes');

const app = express();

// Middleware
// Enable Cross-Origin Resource Sharing for all origins.
app.use(cors());
// Parse incoming JSON payloads from requests.
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    // Exit the process if the database connection fails.
    process.exit(1);
  });

// --- Test Route ---
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running fine ✅" });
});

// Use the imported authentication routes.
// This single line replaces your custom register and login routes.
// All requests to /api/register and /api/login will now be handled by authRoutes.
app.use('/api', authRoutes);
app.use('/api', chatbotRoutes);


// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));