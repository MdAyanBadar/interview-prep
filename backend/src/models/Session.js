// src/models/Session.js
const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  answers: [{
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    userAnswer: String,
    isCorrect: Boolean,
    score: Number,
    feedback: String,
    topic: String
  }],
  score: { type: Number, default: 0 },
  status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
  completedAt: Date
}, { timestamps: true });

// ✅ MAKE SURE THIS LINE IS EXACTLY LIKE THIS
module.exports = mongoose.model("Session", sessionSchema);