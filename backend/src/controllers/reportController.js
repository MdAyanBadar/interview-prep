const Session = require("../models/Session");
const Question = require("../models/Question");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Setup for the Re-check functionality
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * AI GRADING HELPER (Used for Re-check)
 */
async function getAIGrade(question, userAnswer) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Stable model for reliability
  const prompt = `
    Evaluate this technical answer:
    Question: "${question.description}"
    Keywords: ${question.keywords?.join(", ")}
    User Answer: "${userAnswer}"
    Return ONLY JSON: { "isCorrect": boolean, "score": number, "feedback": "string" }
  `;
  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch[0]);
}

/**
 * GET USER PROGRESS / DASHBOARD DATA
 * Provides cumulative stats and trend analysis.
 */
exports.getProgress = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    // 1. Fetch all completed sessions
    const sessions = await Session.find({ user: userId, status: "completed" })
      .sort({ completedAt: -1 }) // Newest sessions first for trend calculation
      .populate({
        path: "answers.question",
        select: "topic"
      });

    if (!sessions || sessions.length === 0) {
      return res.json({
        totalSessions: 0,
        totalQuestions: 0,
        accuracy: 0,
        trend: 0,
        topicStats: []
      });
    }

    let totalQuestions = 0;
    let totalCorrect = 0;
    const topicStats = {};

    // 2. Aggregate overall stats and topic-specific performance
    sessions.forEach(session => {
      session.answers.forEach(ans => {
        const topicName = ans.question?.topic;
        if (!topicName) return;

        totalQuestions++;
        topicStats[topicName] ??= { total: 0, correct: 0 };
        topicStats[topicName].total++;

        if (ans.isCorrect) {
          totalCorrect++;
          topicStats[topicName].correct++;
        }
      });
    });

    const overallAccuracy = Math.round((totalCorrect / totalQuestions) * 100);

    // 3. TREND CALCULATION: Compare last session accuracy vs overall average
    const latestSession = sessions[0];
    const latestAccuracy = latestSession.questions.length > 0 
      ? Math.round((latestSession.score / latestSession.questions.length) * 100) 
      : 0;
    const trend = latestAccuracy - overallAccuracy;

    // 4. Transform topicStats into a sorted array for the Frontend
    const sortedTopics = Object.entries(topicStats)
      .map(([name, stats]) => ({
        name, // The actual name (e.g., "React")
        total: stats.total,
        correct: stats.correct,
        percentage: Math.round((stats.correct / stats.total) * 100)
      }))
      .sort((a, b) => b.percentage - a.percentage); // Strongest first

    res.json({
      totalSessions: sessions.length,
      totalQuestions,
      accuracy: overallAccuracy,
      trend, // Used for the dashboard badge
      topicStats: sortedTopics
    });
  } catch (err) {
    console.error("Progress Error:", err);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
};

/**
 * GET SINGLE SESSION RESULT
 * Used for the Result Summary page.
 */
exports.getSessionResult = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId)
      .populate({
        path: "answers.question",
        select: "description topic keywords sampleAnswer title"
      });

    if (!session) return res.status(404).json({ message: "Session not found" });

    res.json({
      sessionId: session._id,
      score: session.score,
      totalQuestions: session.questions.length,
      accuracy: Math.round((session.score / session.questions.length) * 100),
      results: session.answers.map(ans => ({
        questionId: ans.question?._id,
        topic: ans.question?.topic,
        userAnswer: ans.userAnswer,
        isCorrect: ans.isCorrect,
        score: ans.score,
        feedback: ans.feedback
      }))
    });
  } catch (err) {
    res.status(500).json({ message: "Error loading session details" });
  }
};

/**
 * RE-CHECK SINGLE ANSWER
 * Updates a specific question grade within an existing session.
 */
exports.recheckAnswer = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { questionId, userAnswer } = req.body;

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    // Call AI helper
    const aiResult = await getAIGrade(question, userAnswer);

    // Update the session database record
    await Session.updateOne(
      { _id: sessionId, "answers.question": questionId },
      { 
        $set: { 
          "answers.$.feedback": aiResult.feedback, 
          "answers.$.score": aiResult.score, 
          "answers.$.isCorrect": aiResult.isCorrect 
        } 
      }
    );

    res.json(aiResult);
  } catch (err) {
    console.error("Recheck Error:", err);
    res.status(500).json({ message: "Recheck failed" });
  }
};