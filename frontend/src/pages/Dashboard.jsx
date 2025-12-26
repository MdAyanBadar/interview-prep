import { useEffect, useMemo, useState } from "react";
import { getProgress } from "../api/reports";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getProgress()
      .then(res => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  /* ---------- Derived Analytics ---------- */
  const topicEntries = useMemo(
    () => (stats ? Object.entries(stats.topicStats) : []),
    [stats]
  );

  const weakTopics = useMemo(
    () =>
      topicEntries.filter(
        ([_, data]) =>
          Math.round((data.correct / data.total) * 100) < 60
      ),
    [topicEntries]
  );

  const strongestTopic = useMemo(() => {
    if (!topicEntries.length) return null;

    return topicEntries.reduce((best, current) => {
      const currentAccuracy =
        (current[1].correct / current[1].total) * 100;
      const bestAccuracy =
        best
          ? (best[1].correct / best[1].total) * 100
          : 0;
      return currentAccuracy > bestAccuracy ? current : best;
    }, null);
  }, [topicEntries]);

  /* ---------- Loading Skeleton ---------- */
  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/3 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="h-24 bg-gray-200 rounded-xl" />
          <div className="h-24 bg-gray-200 rounded-xl" />
          <div className="h-24 bg-gray-200 rounded-xl" />
        </div>
        <div className="h-40 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* ---------- Header ---------- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard 📊
          </h1>
          <p className="text-gray-500">
            Track your interview preparation progress
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/practice/start")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow"
          >
            Start Practice 🚀
          </button>

          {weakTopics.length > 0 && (
            <button
              onClick={() =>
                navigate("/practice/start", {
                  state: { focusTopic: weakTopics[0][0] }
                })
              }
              className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-semibold"
            >
              Fix {weakTopics[0][0]} ⚠️
            </button>
          )}
        </div>
      </div>

      {/* ---------- Stats Cards ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Sessions"
          value={stats.totalSessions}
          color="indigo"
        />
        <StatCard
          title="Total Questions"
          value={stats.totalQuestions}
          color="purple"
        />
        <StatCard
          title="Accuracy"
          value={`${stats.accuracy}%`}
          color="green"
        />
      </div>

      {/* ---------- Motivation ---------- */}
      <div className="text-sm text-gray-600">
        {stats.accuracy >= 80
          ? "🔥 Excellent work! You’re interview-ready."
          : stats.accuracy >= 50
          ? "👍 Good progress. Focus on weak topics."
          : "💡 Keep practicing — improvement is coming."}
      </div>

      {/* ---------- Topic Performance ---------- */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Topic Performance
        </h2>

        {topicEntries.length === 0 ? (
          <p className="text-gray-500">
            No practice data yet.
          </p>
        ) : (
          <div className="space-y-4">
            {topicEntries.map(([topic, data]) => {
              const percent = Math.round(
                (data.correct / data.total) * 100
              );

              return (
                <div key={topic}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{topic}</span>
                    <span className="text-sm text-gray-500">
                      {percent}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        percent >= 70
                          ? "bg-green-500"
                          : percent >= 40
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ---------- Weak Topics ---------- */}
      {weakTopics.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="font-semibold text-red-700 mb-2">
            ⚠ Needs Improvement
          </h3>
          <ul className="list-disc list-inside text-red-600 text-sm">
            {weakTopics.map(([topic]) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ---------- Strongest Topic ---------- */}
      {strongestTopic && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="font-semibold text-green-700 mb-2">
            ⭐ Strongest Area
          </h3>
          <p className="text-green-600 text-sm">
            {strongestTopic[0]} — excellent accuracy!
          </p>
        </div>
      )}
    </div>
  );
}

/* ---------- Reusable Stat Card ---------- */
function StatCard({ title, value, color }) {
  const colors = {
    indigo: "from-indigo-500 to-indigo-600",
    purple: "from-purple-500 to-purple-600",
    green: "from-green-500 to-green-600"
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
