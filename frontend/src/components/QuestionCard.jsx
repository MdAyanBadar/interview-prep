import { useState } from "react";
import { addBookmark } from "../api/bookmarks";

export default function QuestionCard({
  question,
  onAnswer,
  bookmarked,
  onBookmark
}) {
  const [answer, setAnswer] = useState("");
  const [saving, setSaving] = useState(false);

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

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <div className="flex justify-between">
        <div>
          <h3 className="font-semibold text-lg">{question.title}</h3>
          <p className="text-sm text-gray-500">Topic: {question.topic}</p>
        </div>
        <span className="text-xs px-3 py-1 rounded bg-gray-100">
          {question.difficulty}
        </span>
      </div>

      <p className="text-gray-700">{question.description}</p>

      <textarea
        rows={5}
        value={answer}
        onChange={e => {
          setAnswer(e.target.value);
          onAnswer(question._id, e.target.value);
        }}
        className="w-full border rounded p-3"
      />

      <div className="flex justify-end">
        <button
          onClick={handleBookmark}
          disabled={bookmarked || saving}
          className={
            bookmarked ? "text-green-600" : "text-indigo-600"
          }
        >
          {bookmarked ? "✓ Bookmarked" : saving ? "Saving..." : "Bookmark"}
        </button>
      </div>
    </div>
  );
}
