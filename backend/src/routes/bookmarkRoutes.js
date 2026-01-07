// ✅ Bookmark Routes - Handles bookmarking questions
const express = require("express");
const auth = require("../middleware/auth");
const {
  addBookmark,
  getBookmarks
} = require("../controllers/bookmarkController");

const router = express.Router();

router.post("/", auth, addBookmark);
router.get("/", auth, getBookmarks);

module.exports = router;
