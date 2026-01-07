import { useEffect, useMemo, useState } from "react";
import { getProgress } from "../api/reports";
import { useNavigate } from "react-router-dom";
import { 
  Trophy, Target, BookOpen, Activity, 
  AlertCircle, TrendingUp, TrendingDown, Rocket,
  Sparkles, Zap
} from "lucide-react";
import PageLoader from "../components/PageLoader";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getProgress()
      .then(res => setStats(res.data))
      .catch(() => console.error("Failed to load dashboard data"))
      .finally(() => setLoading(false));
  }, []);

  const topicEntries = useMemo(
    () => (stats?.topicStats ? stats.topicStats : []),
    [stats]
  );

  const weakTopics = useMemo(
    () => topicEntries.filter((topic) => topic.percentage < 60),
    [topicEntries]
  );

  const strongestTopic = useMemo(() => {
    if (!topicEntries.length) return null;
    return topicEntries[0];
  }, [topicEntries]);

  if (loading) return <PageLoader loadingKey="dashboard"/>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 pb-16">
      {/* --- HERO SECTION --- */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 border-b border-indigo-800/20 mb-10 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-6 py-10 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="text-yellow-300" size={24} />
                <span className="text-indigo-200 text-sm font-semibold tracking-wide uppercase">Dashboard</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
                Welcome Back! 👋
              </h1>
              <p className="text-indigo-100 text-lg max-w-xl">
                Track your progress, identify growth areas, and continue your learning journey.
              </p>
            </div>
            <button
              onClick={() => navigate("/practice/start")}
              className="group flex items-center justify-center gap-2 bg-white hover:bg-indigo-50 text-indigo-600 px-8 py-4 rounded-2xl font-bold shadow-2xl shadow-indigo-900/30 transition-all active:scale-[0.97] hover:shadow-indigo-900/40 hover:-translate-y-0.5"
            >
              <Rocket size={22} className="group-hover:rotate-12 transition-transform" />
              Start Practice Session
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* --- TOP STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            icon={<BookOpen className="text-indigo-600" />} 
            title="Total Sessions" 
            value={stats.totalSessions} 
            subtitle="Practice rounds completed"
            bgColor="bg-indigo-50"
            iconBg="bg-indigo-100"
          />
          <StatCard 
            icon={<Target className="text-purple-600" />} 
            title="Questions Answered" 
            value={stats.totalQuestions} 
            subtitle="Lifetime effort"
            bgColor="bg-purple-50"
            iconBg="bg-purple-100"
          />
          <StatCard 
            icon={<TrendingUp className="text-emerald-600" />} 
            title="Overall Accuracy" 
            value={`${stats.accuracy}%`} 
            trend={stats.trend}
            subtitle={stats.accuracy >= 70 ? "Above average" : "Keep practicing"}
            bgColor="bg-emerald-50"
            iconBg="bg-emerald-100"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- LEFT: TOPIC PERFORMANCE --- */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 hover:shadow-2xl hover:shadow-slate-200/60 transition-shadow">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <Activity size={24} className="text-indigo-600" />
                </div>
                Topic Performance
              </h2>
            </div>

            {topicEntries.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4">
                  <BookOpen className="text-slate-400" size={32} />
                </div>
                <p className="text-slate-500 text-lg font-medium">No data available yet</p>
                <p className="text-slate-400 text-sm mt-1">Start your first session to see insights!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {topicEntries.map((topicData, idx) => (
                  <TopicRow key={topicData.name} topic={topicData.name} data={topicData} index={idx} />
                ))}
              </div>
            )}
          </div>

          {/* --- RIGHT: INSIGHTS & ACTIONS --- */}
          <div className="space-y-6">
            {/* Action Card: Weak Topic */}
            {weakTopics.length > 0 && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-7 shadow-lg shadow-amber-100/50 hover:shadow-xl hover:shadow-amber-100/60 transition-all hover:-translate-y-1">
                <div className="flex items-center gap-3 text-amber-900 mb-4">
                  <div className="p-2 bg-amber-200 rounded-xl">
                    <AlertCircle size={22} />
                  </div>
                  <h3 className="font-bold text-lg">Focus Needed</h3>
                </div>
                <p className="text-amber-800 text-sm mb-5 leading-relaxed">
                  Your accuracy in <span className="font-bold text-amber-900">{weakTopics[0].name}</span> is currently <span className="font-bold">{weakTopics[0].percentage}%</span>. Let's improve it together.
                </p>
                <button 
                  onClick={() => navigate("/practice/start", { state: { focusTopic: weakTopics[0].name } })}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Zap size={16} />
                  Start Focused Practice
                </button>
              </div>
            )}

            {/* Achievement Card: Strong Topic */}
            {strongestTopic && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-3xl p-7 shadow-lg shadow-emerald-100/50 hover:shadow-xl hover:shadow-emerald-100/60 transition-all hover:-translate-y-1">
                <div className="flex items-center gap-3 text-emerald-900 mb-3">
                  <div className="p-2 bg-emerald-200 rounded-xl">
                    <Trophy size={22} />
                  </div>
                  <h3 className="font-bold text-lg">Peak Performance</h3>
                </div>
                <p className="text-emerald-800 text-sm leading-relaxed">
                  You're crushing it in <span className="font-bold text-emerald-900">{strongestTopic.name}</span> with <span className="font-bold">{strongestTopic.percentage}%</span> accuracy! 
                  <span className="block mt-2">Keep up the excellent work! 🎯</span>
                </p>
              </div>
            )}

            {/* Motivational Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-3xl p-7 shadow-lg shadow-indigo-100/50">
              <div className="flex items-center gap-3 text-indigo-900 mb-3">
                <div className="p-2 bg-indigo-200 rounded-xl">
                  <Sparkles size={22} />
                </div>
                <h3 className="font-bold text-lg">Quick Tip</h3>
              </div>
              <p className="text-indigo-800 text-sm leading-relaxed">
                Consistent practice is key! Try to complete at least one session daily to maintain momentum and improve retention.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ icon, title, value, subtitle, trend, bgColor, iconBg }) {
  const isPositive = trend > 0;

  return (
    <div className={`${bgColor} backdrop-blur-sm p-7 rounded-3xl shadow-xl shadow-slate-200/50 border-2 border-white/60 flex items-start gap-5 hover:shadow-2xl hover:shadow-slate-200/60 transition-all hover:-translate-y-1 group`}>
      <div className={`p-4 ${iconBg} rounded-2xl group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{title}</p>
          
          {trend !== undefined && trend !== 0 && (
            <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
              isPositive ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-800'
            }`}>
              {isPositive ? <TrendingUp size={12}/> : <TrendingDown size={12}/>} 
              {Math.abs(trend)}%
            </span>
          )}
        </div>
        <h3 className="text-3xl font-extrabold text-slate-900 mt-2 mb-1">{value}</h3>
        <p className="text-sm text-slate-500 font-medium">{subtitle}</p>
      </div>
    </div>
  );
}

function TopicRow({ topic, data, index }) {
  const percent = data.percentage;
  
  return (
    <div className="group hover:bg-slate-50 p-4 rounded-2xl transition-all -mx-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-bold group-hover:bg-indigo-200 transition-colors">
            {index + 1}
          </span>
          <span className="font-bold text-slate-800 text-lg">{topic}</span>
        </div>
        <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${
          percent >= 70 ? 'bg-emerald-100 text-emerald-700' : 
          percent >= 40 ? 'bg-amber-100 text-amber-700' : 
          'bg-red-100 text-red-700'
        }`}>
          {percent}%
        </span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-1000 shadow-sm ${
            percent >= 70 ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : 
            percent >= 40 ? "bg-gradient-to-r from-amber-400 to-amber-500" : 
            "bg-gradient-to-r from-red-400 to-red-500"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
        <span>{data.correct} of {data.total} correct</span>
        <span className="font-medium">
          {percent >= 70 ? '🎯 Excellent' : percent >= 40 ? '📈 Improving' : '💪 Keep going'}
        </span>
      </div>
    </div>
  );
}

function DashboardLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 pb-16">
      <div className="p-10 max-w-7xl mx-auto animate-pulse space-y-10">
        <div className="h-32 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-3xl w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl" />
          <div className="space-y-6">
            <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl" />
            <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}