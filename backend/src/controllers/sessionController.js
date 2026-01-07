const Session = require("../models/Session");
const Question = require("../models/Question");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * AI GRADING HELPER
 * Cleans the AI response to ensure valid JSON parsing.
 */
async function getAIGrade(question, userAnswer, retryCount = 0) {
  try {
    if (retryCount > 0) await delay(2000 * retryCount);
    // Corrected to gemini-1.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `
      You are a technical interviewer. Evaluate the candidate's answer.
      Question: "${question.description}"
      Expected Keywords: ${question.keywords?.join(", ")}
      Candidate Answer: "${userAnswer}"

      IMPORTANT: Return ONLY a valid JSON object. No markdown.
      { "isCorrect": boolean, "score": number, "feedback": "string" }
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    
    // Clean potential markdown backticks from AI response
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI JSON structure");
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("AI Grading Error:", error);
    if (error.status === 429 && retryCount < 2) return getAIGrade(question, userAnswer, retryCount + 1);
    return { isCorrect: false, score: 0, feedback: "AI evaluation unavailable at the moment." };
  }
}

/**
 * START SESSION
 * Fixed: Guaranteed mix of types when "mixed" is selected.
 */
exports.startSession = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { topic, difficulty, limit = 5, type } = req.body;
    
    const baseFilter = {};
    if (topic && topic !== "All") baseFilter.topic = topic;
    if (difficulty && difficulty !== "All") baseFilter.difficulty = difficulty;

    let questions = [];

    if (type === "mixed") {
      // Split the limit between types (e.g., 50/50 mix)
      const mcqCount = Math.ceil(limit / 2);
      const saCount = Math.floor(limit / 2);

      const mcqRes = await Question.aggregate([
        { $match: { ...baseFilter, type: "mcq" } },
        { $sample: { size: mcqCount } }
      ]);

      const saRes = await Question.aggregate([
        { $match: { ...baseFilter, type: "short-answer" } },
        { $sample: { size: saCount } }
      ]);

      questions = [...mcqRes, ...saRes].sort(() => Math.random() - 0.5);
    } else {
      // Specific type selection
      if (type) baseFilter.type = type;
      questions = await Question.aggregate([
        { $match: baseFilter }, 
        { $sample: { size: Number(limit) } }
      ]);
    }

    if (!questions.length) return res.status(404).json({ message: "No questions found matching criteria." });

    const session = await Session.create({ 
      user: userId, 
      questions: questions.map(q => q._id), 
      status: "in-progress" 
    });

    res.status(201).json({ sessionId: session._id, questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * SUBMIT SESSION
 * Processes MCQs locally and Short Answers via AI.
 */
exports.submitSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { answers } = req.body; 

    const session = await Session.findById(sessionId).populate("questions");
    if (!session) return res.status(404).json({ message: "Session not found." });

    const evaluatedResults = [];

    for (const ans of answers) {
      const qData = session.questions.find(q => q._id.toString() === ans.questionId.toString());
      if (!qData) continue;

      const hasValue = ans.userAnswer !== undefined && ans.userAnswer !== null && ans.userAnswer !== "";

      if (!hasValue) {
        evaluatedResults.push({
          question: qData._id,
          topic: qData.topic,
          userAnswer: "",
          isCorrect: false, score: 0, feedback: "No answer provided."
        });
        continue;
      }

      if (qData.type === "mcq") {
        const userSelectionIndex = parseInt(ans.userAnswer);
        const isCorrect = userSelectionIndex === qData.correctOption;
        
        evaluatedResults.push({
          question: qData._id,
          topic: qData.topic,
          userAnswer: qData.options[userSelectionIndex] || "Invalid selection",
          isCorrect,
          score: isCorrect ? 100 : 0,
          feedback: isCorrect 
            ? `✨ Correct! ${qData.explanation || ""}` 
            : `❌ Incorrect. The right answer was: ${qData.options[qData.correctOption]}. ${qData.explanation || ""}`
        });
      } else {
        const aiResult = await getAIGrade(qData, ans.userAnswer);
        evaluatedResults.push({
          question: qData._id,
          topic: qData.topic,
          userAnswer: ans.userAnswer,
          ...aiResult
        });
        // Delay to prevent hitting rate limits for multiple short answers
        await delay(1200); 
      }
    }

    session.answers = evaluatedResults;
    session.score = evaluatedResults.filter(r => r.isCorrect).length;
    session.status = "completed";
    session.completedAt = new Date();
    await session.save();

    res.json(session);
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ message: "Evaluation failed during submission." });
  }
};