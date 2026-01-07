const express = require("express");
const router = express.Router();
// Import the whole object
const sessionController = require("../controllers/sessionController");
const auth = require("../middleware/auth");

// Add a debug log here to see what is actually being loaded
console.log("Checking Controller Functions:", {
  start: typeof sessionController.startSession,
  submit: typeof sessionController.submitSession
});

// Use the object properties
router.post("/start", auth, sessionController.startSession);
router.post("/:sessionId/submit", auth, sessionController.submitSession);

module.exports = router;