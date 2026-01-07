require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

// 1. Better Database Connection Handling
// This ensures the app doesn't start if the DB connection fails
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected Successfully");

    // 2. Dynamic Port Assignment
    // Render and Vercel provide a PORT via environment variables. 
    // If they don't provide one, it defaults to 5000.
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); // Exit with failure
  }
};

startServer();