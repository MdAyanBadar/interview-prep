const express = require("express");
const auth = require("../middleware/auth");
const {
  startSession,
  submitSession
} = require("../controllers/sessionController");

const router = express.Router();

router.post("/start", auth, startSession);
router.post("/:sessionId/submit", auth, submitSession);

module.exports = router;
