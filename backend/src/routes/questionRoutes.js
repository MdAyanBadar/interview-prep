const express = require("express");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const {
  createQuestion,
  getQuestions
} = require("../controllers/questionController");

const router = express.Router();

/**
 * @route   POST /api/questions
 * @desc    Create a new question (Admin only)
 * @access  Private (Admin)
 */
router.post("/", auth, role("admin"), createQuestion);

/**
 * @route   GET /api/questions
 * @desc    Get questions (with filters & pagination)
 * @access  Private (User/Admin)
 */
router.get("/", auth, getQuestions);

module.exports = router;
