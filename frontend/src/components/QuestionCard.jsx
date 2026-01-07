import { useState, useEffect } from "react";
import { addBookmark } from "../api/bookmarks";

export default function QuestionCard({
  question,
  onAnswer,
  bookmarked,
  onBookmark,
  initialAnswer = "" 
}) {
  const [answer, setAnswer] = useState(initialAnswer);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setAnswer(initialAnswer);
  }, [initialAnswer]);

  const handleBookmark = async () => {
    if (bookmarked) return;
    setSaving(true);
    try {
      await addBookmark(question._id);
      onBookmark();
    } catch {
      alert("Failed to bookmark question");
    } finally {
      setSaving(false);
    }
  };

  const handleMcqSelect = (index) => {
    const stringIndex = index.toString(); // Convert to string for consistency
    setAnswer(stringIndex);
    onAnswer(stringIndex); 
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
               question.type === 'mcq' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
             }`}>
               {question.type === 'mcq' ? 'Multiple Choice' : 'AI Analysis'}
             </span>
             <p className="text-sm font-medium text-indigo-600 uppercase tracking-wider">
               {question.topic}
             </p>
          </div>
          <h3 className="font-bold text-xl text-gray-900">{question.title}</h3>
        </div>
        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-gray-100 text-gray-500 uppercase">
          {question.difficulty}
        </span>
      </div>

      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
        <p className="text-gray-700 leading-relaxed">{question.description}</p>
      </div>

      {/* DYNAMIC INPUT AREA */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
          {question.type === "mcq" ? "Select the correct option" : "Your Response"}
        </label>

        {question.type === "mcq" ? (
          /* MCQ OPTIONS RENDERING */
          <div className="grid grid-cols-1 gap-3">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleMcqSelect(index)}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                  parseInt(answer) === index
                    ? "border-indigo-600 bg-indigo-50 shadow-sm"
                    : "border-gray-100 hover:border-gray-200 bg-white"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                  parseInt(answer) === index ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className={`font-semibold ${parseInt(answer) === index ? "text-indigo-900" : "text-gray-700"}`}>
                  {option}
                </span>
              </button>
            ))}
          </div>
        ) : (
          /* SHORT ANSWER TEXTAREA */
          <textarea
            rows={6}
            value={answer}
            onChange={(e) => {
              const val = e.target.value;
              setAnswer(val);
              onAnswer(val); 
            }}
            placeholder="Type your detailed technical explanation here..."
            className="w-full border-2 border-gray-100 rounded-2xl p-4 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 transition-all outline-none resize-none text-gray-800"
          />
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleBookmark}
          disabled={bookmarked || saving}
          className={`flex items-center gap-2 font-bold text-sm transition-all ${
            bookmarked ? "text-green-600" : "text-indigo-600 hover:text-indigo-700"
          }`}
        >
          {bookmarked ? "✓ Saved to Bookmarks" : saving ? "Saving..." : "+ Bookmark Question"}
        </button>
      </div>
    </div>
  );
}