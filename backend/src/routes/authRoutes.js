// ✅ Auth Routes - Handles user registration and login
console.log("AUTH ROUTES LOADED");
const express = require("express");
const {
  register,
  login,
  profile
} = require("../controllers/authController");
const auth = require("../middleware/auth");

const router = express.Router();

// PUBLIC
router.post("/register", (req, res, next) => {
  console.log("REGISTER ROUTE HIT");
  next();
}, register);

router.post("/login", login);

// PROTECTED
router.get("/profile", auth, profile);

module.exports = router;
