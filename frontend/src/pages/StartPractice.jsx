import { useState } from "react";
import { startSession } from "../api/sessions";
import { useNavigate } from "react-router-dom";
import { toastSuccess, toastError } from "../utils/toast";


export default function StartPractice() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleStart = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await startSession({
        topic: topic || undefined,
        difficulty,
        limit
      });
      toastSuccess("Practice session started 🚀");
      navigate(`/practice/${res.data.sessionId}`, {
        state: res.data.questions
      });
    } catch (err) {
      toastError("No questions found. Try different options.");
      setError("No questions found. Try different options.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Start Practice 🚀
        </h1>
        <p className="text-gray-500 mb-6">
          Customize your interview practice session
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        {/* Topic */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Topic (optional)
          </label>
          <input
            type="text"
            placeholder="JavaScript, React, Node.js..."
            value={topic}
            onChange={e => setTopic(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Difficulty */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <div className="flex gap-3">
            {["easy", "medium", "hard"].map(level => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`flex-1 py-2 rounded-lg border font-medium transition ${
                  difficulty === level
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Question Limit */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Questions
          </label>
          <select
            value={limit}
            onChange={e => setLimit(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value={5}>5 Questions</option>
            <option value={10}>10 Questions</option>
            <option value={15}>15 Questions</option>
          </select>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? "Starting Session..." : "Start Practice"}
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-4">
          You can review your performance after completing the session
        </p>
      </div>
    </div>
  );
}
