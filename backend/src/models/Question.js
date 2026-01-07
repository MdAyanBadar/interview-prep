const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    topic: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true
    },
    // --- NEW FIELD: TYPE ---
    type: {
      type: String,
      enum: ["short-answer", "mcq"],
      default: "short-answer",
      required: true
    },

    // --- MCQ SPECIFIC FIELDS ---
    options: {
      type: [String],
      // Only required if type is mcq
      validate: {
        validator: function (v) {
          return this.type === "mcq" ? v && v.length >= 2 : true;
        },
        message: "MCQ questions must have at least 2 options."
      }
    },
    correctOption: {
      type: Number, // Index of the correct option (0, 1, 2, or 3)
      validate: {
        validator: function (v) {
          return this.type === "mcq" ? v !== undefined && v !== null : true;
        },
        message: "MCQ questions must have a correct option index."
      }
    },
    explanation: {
      type: String, // Why the answer is correct (shown after submission)
      required: false 
    },

    // --- SHORT ANSWER SPECIFIC FIELDS ---
    keywords: {
      type: [String],
      // Only required if short-answer
      required: function () {
        return this.type === "short-answer";
      }
    },
    sampleAnswer: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);