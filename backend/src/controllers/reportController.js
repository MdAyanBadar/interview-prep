const Session = require("../models/Session");

/**
 * GET USER PROGRESS / DASHBOARD DATA
 * GET /api/reports/progress
 */
exports.getProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch completed sessions with populated question topics
    const sessions = await Session.find({
      user: userId,
      status: "completed"
    }).populate({
      path: "answers.question",
      model: "Question",
      select: "topic"
    });

    let totalSessions = sessions.length;
    let totalQuestions = 0;
    let totalCorrect = 0;
    const topicStats = {};

    sessions.forEach(session => {
      session.answers.forEach(ans => {
        const topic = ans.question?.topic;

        // Skip answers with missing question/topic
        if (!topic) return;

        totalQuestions++;

        if (!topicStats[topic]) {
          topicStats[topic] = {
            total: 0,
            correct: 0
          };
        }

        topicStats[topic].total++;

        if (ans.isCorrect) {
          totalCorrect++;
          topicStats[topic].correct++;
        }
      });
    });

    const accuracy =
      totalQuestions === 0
        ? 0
        : Math.round((totalCorrect / totalQuestions) * 100);

    res.json({
      totalSessions,
      totalQuestions,
      totalCorrect,
      accuracy,
      topicStats
    });
  } catch (err) {
    console.error("Progress Error:", err);
    res.status(500).json({
      message: "Failed to load progress data"
    });
  }
};

/**
 * GET SINGLE SESSION RESULT
 * GET /api/reports/session/:sessionId
 */
exports.getSessionResult = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const session = await Session.findOne({
      _id: sessionId,
      user: userId
    })
      .populate("questions", "title topic difficulty")
      .populate({
        path: "answers.question",
        model: "Question",
        select: "title topic difficulty keywords"
      });

    if (!session) {
      return res.status(404).json({
        message: "Session not found"
      });
    }

    res.json({
      sessionId: session._id,
      score: session.score,
      totalQuestions: session.questions.length,
      accuracy: Math.round(
        (session.score / session.questions.length) * 100
      ),
      answers: session.answers
    });
  } catch (err) {
    console.error("Session Result Error:", err);
    res.status(500).json({
      message: "Failed to load session result"
    });
  }
};
