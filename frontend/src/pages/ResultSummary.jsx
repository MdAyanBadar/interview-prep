import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function ResultSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId } = useParams();

  // ✅ SAFE destructuring with defaults
  const {
    score = 0,
    total = 0,
    accuracy = 0,
    topicStats = {}
  } = location.state || {};

  // ✅ Handle direct access / refresh
  if (!location.state) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Session data not found
        </h2>
        <p className="text-gray-500 mb-6 text-center">
          Please complete a practice session to view results.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* ---------- Header ---------- */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Session Summary 🎯
          </h1>
          <p className="text-gray-500 mt-2">
            Review your interview practice performance
          </p>
        </div>

        {/* ---------- Stats ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Score" value={`${score}/${total}`} color="indigo" />
          <StatCard title="Accuracy" value={`${accuracy}%`} color="green" />
          <StatCard
            title="Session"
            value={sessionId?.slice(-6)}
            color="purple"
          />
        </div>

        {/* ---------- Topic Breakdown ---------- */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Topic-wise Performance
          </h2>

          {Object.keys(topicStats).length === 0 ? (
            <p className="text-gray-500">
              No topic data available for this session.
            </p>
          ) : (
            <div className="space-y-3">
              {Object.entries(topicStats).map(([topic, data]) => (
                <div
                  key={topic}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                >
                  <span className="font-medium">{topic}</span>
                  <span className="text-sm text-gray-600">
                    {data.correct}/{data.total} correct
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---------- Actions ---------- */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/practice/start")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Practice Again 🔁
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Stat Card ---------- */
function StatCard({ title, value, color }) {
  const colors = {
    indigo: "from-indigo-500 to-indigo-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600"
  };

  return (
    <div
      className={`bg-gradient-to-br ${colors[color]} text-white rounded-xl p-6 shadow`}
    >
      <p className="text-sm opacity-90">{title}</p>
      <h3 className="text-3xl font-bold mt-2">{value}</h3>
    </div>
  );
}
