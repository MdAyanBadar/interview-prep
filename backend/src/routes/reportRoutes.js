const express = require("express");
const auth = require("../middleware/auth");
const {
  getProgress,
  getSessionResult
} = require("../controllers/reportController");

const router = express.Router();

router.get("/progress", auth, getProgress);
router.get("/session/:sessionId", auth, getSessionResult);

module.exports = router;
