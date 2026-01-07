const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const questionRoutes = require("./routes/questionRoutes");
const sessionRoutes = require("./routes/sessionRoutes"); 
const reportRoutes = require("./routes/reportRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");

const app = express();

// --- IMPROVED CORS ---
// This allows your specific Vercel URL and local testing
const allowedOrigins = [
  "https://interview-prep-b9m7.vercel.app",
  "http://localhost:5175", // Vite default
  "http://localhost:3000"  // Create React App default
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/sessions", sessionRoutes); 
app.use("/api/reports", reportRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

app.get("/", (req, res) => {
  res.send("Interview Prep API running");
});

module.exports = app;