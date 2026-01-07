// ✅ Question Controller - Handles creating and fetching questions
const Question = require("../models/Question");

exports.createQuestion = async (req, res) => {
  const q = await Question.create({ ...req.body, createdBy: req.user.id });
  res.status(201).json(q);
};

exports.getQuestions = async (req, res) => {
  const { topic, difficulty, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (topic) filter.topic = topic;
  if (difficulty) filter.difficulty = difficulty;

  const questions = await Question.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json(questions);
};
