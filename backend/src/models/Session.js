const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true
      }
    ],

    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question"
        },
        userAnswer: String,
        isCorrect: Boolean,
        matchedKeywords: [String]
      }
    ],

    score: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["started", "completed"],
      default: "started"
    },

    startedAt: {
      type: Date,
      default: Date.now
    },

    completedAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
