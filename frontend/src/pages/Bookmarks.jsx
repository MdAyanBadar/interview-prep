import { useEffect, useState } from "react";
import { getBookmarks } from "../api/bookmarks";
import { useNavigate } from "react-router-dom";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await getBookmarks();
        setBookmarks(res.data?.bookmarks || []);
      } catch (err) {
        setError("Failed to load bookmarks.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-28 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  /* ---------- Error ---------- */
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  /* ---------- Empty ---------- */
  if (!bookmarks.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          No Bookmarks Yet ⭐
        </h2>
        <p className="text-gray-500 mb-6">
          Bookmark questions during practice to review them later.
        </p>
        <button
          onClick={() => navigate("/practice/start")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Start Practicing
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* ---------- Header ---------- */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Bookmarked Questions ⭐
        </h1>
        <p className="text-gray-500">
          Review important questions anytime
        </p>
      </div>

      {/* ---------- Cards ---------- */}
      <div className="space-y-6">
        {bookmarks.map(b => {
          const q = b.question;
          if (!q) return null;

          return (
            <div
              key={b._id}
              className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {q.title}
                </h3>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    q.difficulty === "easy"
                      ? "bg-green-100 text-green-700"
                      : q.difficulty === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {q.difficulty}
                </span>
              </div>

              {/* Meta */}
              <p className="text-sm text-gray-500 mb-3">
                Topic: {q.topic}
              </p>

              {/* Actions */}
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => navigate("/practice/start")}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  Practice Similar →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
