// ✅ Bookmark Controller - Handles bookmarking questions
const Bookmark = require("../models/Bookmark");

// ADD BOOKMARK
const addBookmark = async (req, res) => {
  const userId = req.user.id;
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ message: "Question ID required" });
  }

  try {
    const bookmark = await Bookmark.create({
      user: userId,
      question
    });

    res.status(201).json({
      message: "Question bookmarked",
      bookmark
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Question already bookmarked"
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// GET USER BOOKMARKS
const getBookmarks = async (req, res) => {
  const userId = req.user.id;

  const bookmarks = await Bookmark.find({ user: userId })
    .populate("question", "title topic difficulty")
    .sort({ createdAt: -1 });

  res.json({
    total: bookmarks.length,
    bookmarks
  });
};

module.exports = {
  addBookmark,
  getBookmarks
};
