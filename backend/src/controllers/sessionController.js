const Session = require("../models/Session");
const Question = require("../models/Question");

// START SESSION
exports.startSession = async (req, res) => {
  const userId = req.user.id;
  const { topic, difficulty, limit = 5 } = req.body;

  const filter = {};
  if (topic) filter.topic = topic;
  if (difficulty) filter.difficulty = difficulty;

  const questions = await Question.aggregate([
    { $match: filter },
    { $sample: { size: Number(limit) } }
  ]);

  if (!questions.length) {
    return res.status(404).json({ message: "No questions found" });
  }

  const session = await Session.create({
    user: userId,
    questions: questions.map(q => q._id)
  });

  res.status(201).json({
    sessionId: session._id,
    questions: questions.map(q => ({
      _id: q._id,
      title: q.title,
      description: q.description,
      topic: q.topic,
      difficulty: q.difficulty
    }))
  });
};

// SUBMIT SESSION (KEYWORD BASED)
exports.submitSession = async (req, res) => {
  const { sessionId } = req.params;
  const { answers } = req.body;

  const session = await Session.findById(sessionId).populate("questions");
  if (!session) return res.status(404).json({ message: "Session not found" });

  if (session.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (session.status === "completed") {
    return res.status(400).json({ message: "Already submitted" });
  }

  let score = 0;
  const evaluated = {};
  const topicStats = {};

  for (const ans of answers) {
    const q = session.questions.find(
      x => x._id.toString() === ans.questionId
    );
    if (!q) continue;

    const userAnswer = ans.userAnswer.toLowerCase();
    const matched = q.keywords.filter(k =>
      userAnswer.includes(k.toLowerCase())
    );

    const isCorrect =
      matched.length >= Math.ceil(q.keywords.length / 2);

    if (isCorrect) score++;

    topicStats[q.topic] ??= { total: 0, correct: 0 };
    topicStats[q.topic].total++;
    if (isCorrect) topicStats[q.topic].correct++;

    evaluated[q._id] = {
      userAnswer: ans.userAnswer,
      isCorrect,
      matched
    };
  }

  session.answers = Object.entries(evaluated).map(([id, v]) => ({
    question: id,
    ...v
  }));

  session.score = score;
  session.status = "completed";
  session.completedAt = new Date();

  await session.save();

  res.json({
    message: "Session submitted successfully",
    score,
    totalQuestions: session.questions.length,
    accuracy: Math.round((score / session.questions.length) * 100),
    topicStats
  });
};
