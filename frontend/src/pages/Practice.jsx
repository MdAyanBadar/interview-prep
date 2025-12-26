import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { submitSession } from "../api/sessions";
import QuestionCard from "../components/QuestionCard";

export default function Practice() {
  const { state: questions } = useLocation();
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState({});

  const handleAnswer = (questionId, userAnswer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: userAnswer
    }));
  };

  const handleSubmit = async () => {
    setError("");

    if (Object.keys(answers).length === 0) {
      setError("Please answer at least one question before submitting.");
      return;
    }

    setLoading(true);
    try {
      const formattedAnswers = Object.entries(answers).map(
        ([questionId, userAnswer]) => ({ questionId, userAnswer })
      );

      const res = await submitSession(sessionId, formattedAnswers);
      navigate(`/results/${sessionId}`, { state: res.data });
    } catch {
      setError("Failed to submit session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        No questions found for this session.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Practice Session 🧠</h1>
          <span className="text-gray-600">
            Questions: {questions.length}
          </span>
        </div>

        {error && (
          <div className="text-red-600 bg-red-50 p-3 rounded">{error}</div>
        )}

        {questions.map((q, index) => (
          <QuestionCard
            key={q._id}
            question={{ ...q, title: `Q${index + 1}. ${q.title}` }}
            onAnswer={handleAnswer}
            bookmarked={bookmarkedQuestions[q._id]}
            onBookmark={() =>
              setBookmarkedQuestions(prev => ({
                ...prev,
                [q._id]: true
              }))
            }
          />
        ))}

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold"
          >
            {loading ? "Submitting..." : "Submit Session"}
          </button>
        </div>
      </div>
    </div>
  );
}
