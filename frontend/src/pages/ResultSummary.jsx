import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { 
  Trophy, ArrowRight, Home, RotateCcw, CheckCircle2, 
  Target, MessageSquare, XCircle, RefreshCw, Award, 
  Sparkles, ChevronRight, Hash, Quote, TrendingUp, 
  Zap, Star
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ResultSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId } = useParams();
  
  const [currentResults, setCurrentResults] = useState(location.state?.results || []);
  const [recheckingId, setRecheckingId] = useState(null);
  
  const {
    score = 0,
    total = 0,
    accuracy = 0,
  } = location.state || {};

  const handleRecheck = async (index, questionId, userAnswer) => {
    setRecheckingId(index);
    try {
      const response = await axios.post(`/api/sessions/recheck/${sessionId}`, {
        questionId,
        userAnswer
      });
      const updatedFeedback = response.data;
      
      const newResults = [...currentResults];
      newResults[index] = { ...newResults[index], ...updatedFeedback };
      setCurrentResults(newResults);
      toast.success("AI re-evaluation complete!");
    } catch (err) {
      toast.error("Failed to re-check. Please try again.");
    } finally {
      setRecheckingId(null);
    }
  };

  if (!location.state) return <MissingDataState navigate={navigate} />;

  // Performance Configuration
  const config = useMemo(() => {
    if (accuracy >= 90) return { 
      label: "Exceptional", 
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      bg: "bg-emerald-500",
      text: "text-emerald-600",
      bgLight: "bg-emerald-50",
      border: "border-emerald-200",
      icon: "🏆" 
    };
    if (accuracy >= 75) return { 
      label: "Excellent", 
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      bg: "bg-blue-500",
      text: "text-blue-600",
      bgLight: "bg-blue-50",
      border: "border-blue-200",
      icon: "⭐" 
    };
    if (accuracy >= 60) return { 
      label: "Good", 
      gradient: "from-amber-500 via-orange-500 to-yellow-500",
      bg: "bg-amber-500",
      text: "text-amber-600",
      bgLight: "bg-amber-50",
      border: "border-amber-200",
      icon: "👍" 
    };
    return { 
      label: "Developing", 
      gradient: "from-rose-500 via-pink-500 to-red-500",
      bg: "bg-rose-500",
      text: "text-rose-600",
      bgLight: "bg-rose-50",
      border: "border-rose-200",
      icon: "🎯" 
    };
  }, [accuracy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pb-20">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br ${config.gradient} rounded-full blur-[120px] opacity-20 animate-pulse`} />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-indigo-400 to-purple-400 rounded-full blur-[100px] opacity-10" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-32">
          <button 
            onClick={() => navigate("/dashboard")}
            className="group flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-8 transition-all hover:gap-3"
          >
            <ArrowRight size={18} className="rotate-180 transition-transform group-hover:-translate-x-1" /> 
            Back to Dashboard
          </button>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-slate-200/50">
                <div className={`w-2 h-2 rounded-full ${config.bg} animate-pulse`} />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Session Complete</span>
              </div>
              
              <div className="space-y-3">
                <h1 className="text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 leading-tight">
                  {config.label}
                </h1>
                <div className="flex items-center gap-3">
                  <div className={`h-1.5 w-24 rounded-full bg-gradient-to-r ${config.gradient}`} />
                  <span className="text-2xl font-bold text-slate-400">Performance</span>
                </div>
              </div>
              
              <p className="text-lg text-slate-600 font-medium max-w-xl leading-relaxed">
                Your session has been analyzed with AI precision. Here's a comprehensive breakdown of your performance.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <StatBadge icon={Target} label="Questions" value={total} />
                <StatBadge icon={CheckCircle2} label="Correct" value={score} />
                <StatBadge icon={TrendingUp} label="Accuracy" value={`${accuracy}%`} />
              </div>
            </div>

            {/* Enhanced Score Card */}
            <div className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500`} />
              
              <div className="relative bg-white/90 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/20">
                <div className="flex flex-col items-center gap-6">
                  {/* Circular Progress */}
                  <div className="relative">
                    <svg className="w-36 h-36 transform -rotate-90">
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" className={config.text} />
                          <stop offset="100%" className={config.text} style={{stopOpacity: 0.6}} />
                        </linearGradient>
                      </defs>
                      <circle cx="72" cy="72" r="60" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                      <circle 
                        cx="72" cy="72" r="60" 
                        stroke="url(#progressGradient)" 
                        strokeWidth="12" 
                        fill="transparent" 
                        strokeDasharray={376.8}
                        strokeDashoffset={376.8 - (376.8 * accuracy) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-black text-slate-900">{accuracy}%</div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-1">Score</div>
                      </div>
                    </div>
                  </div>

                  {/* Score Details */}
                  <div className="text-center space-y-2">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl ${config.bgLight} ${config.border} border`}>
                      <Award className={config.text} size={18} />
                      <span className={`font-black ${config.text} text-sm`}>{config.label}</span>
                    </div>
                    <p className="text-sm text-slate-500 font-semibold">{score} out of {total} correct</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Insights Card */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-slate-200/50">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles size={18} className="text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Quick Insights</h3>
              </div>
              <div className="space-y-4">
                <InsightRow icon={Hash} label="Session ID" value={sessionId?.slice(-8).toUpperCase()} />
                <InsightRow icon={Award} label="Performance" value={config.label} accent={config.text} />
                <InsightRow icon={Target} label="Total Questions" value={total} />
                <InsightRow icon={Star} label="Success Rate" value={`${accuracy}%`} />
              </div>
            </div>

            {/* CTA Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-3xl shadow-2xl group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-purple-500 rounded-full blur-[100px] opacity-10" />
              
              <div className="relative space-y-4">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Trophy size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white mb-2">Ready for more?</h3>
                  <p className="text-slate-400 text-sm font-medium">Challenge yourself with a new practice session.</p>
                </div>
                <button 
                  onClick={() => navigate("/practice/start")}
                  className="w-full bg-white hover:bg-indigo-50 text-slate-900 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:gap-3 shadow-lg hover:shadow-xl group"
                >
                  Start New Session 
                  <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Results List */}
          <div className="lg:col-span-2 space-y-6">
            {currentResults.map((res, index) => (
              <div 
                key={index} 
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                {/* Question Header */}
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black shadow-lg ${
                        res.isCorrect 
                          ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white' 
                          : 'bg-gradient-to-br from-rose-400 to-pink-500 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                          <Zap size={10} /> {res.topic}
                        </span>
                        <h4 className="font-bold text-slate-800 text-lg">Question {index + 1}</h4>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                        res.isCorrect 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {res.isCorrect ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {res.score}%
                      </div>
                      <button 
                        onClick={() => handleRecheck(index, res.question, res.userAnswer)}
                        disabled={recheckingId === index}
                        className="p-3 bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RefreshCw size={16} className={recheckingId === index ? 'animate-spin' : ''} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                  {/* User Answer */}
                  <div className="relative">
                    <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-200 to-transparent rounded-full" />
                    <div className="bg-slate-50/70 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/50">
                      <div className="flex gap-3">
                        <Quote className="text-slate-300 shrink-0 mt-1" size={20} />
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Your Answer</p>
                          <p className="text-sm font-medium text-slate-700 leading-relaxed">
                            {res.userAnswer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Feedback */}
                  <div className={`relative overflow-hidden rounded-2xl ${
                    res.isCorrect ? 'bg-gradient-to-br from-emerald-50 to-teal-50' : 'bg-gradient-to-br from-amber-50 to-orange-50'
                  }`}>
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${
                          res.isCorrect ? 'bg-gradient-to-br from-emerald-500 to-teal-500' : 'bg-gradient-to-br from-amber-500 to-orange-500'
                        } text-white shadow-lg`}>
                          <Sparkles size={18} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className={`text-xs font-bold uppercase tracking-wider ${
                              res.isCorrect ? 'text-emerald-700' : 'text-amber-700'
                            }`}>
                              AI Evaluation
                            </p>
                            <div className={`h-1 flex-1 max-w-[60px] rounded-full ${
                              res.isCorrect ? 'bg-emerald-200' : 'bg-amber-200'
                            }`} />
                          </div>
                          <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                            {res.feedback}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Enhanced Helper Components */

function StatBadge({ icon: Icon, label, value }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50">
      <Icon size={16} className="text-indigo-500" />
      <span className="text-xs font-semibold text-slate-600">{label}</span>
      <span className="text-sm font-black text-slate-900">{value}</span>
    </div>
  );
}

function InsightRow({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center justify-between group hover:bg-slate-50 p-3 rounded-xl transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-100 text-slate-400 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all">
          <Icon size={16} />
        </div>
        <span className="text-sm font-semibold text-slate-600">{label}</span>
      </div>
      <span className={`text-sm font-black ${accent || 'text-slate-900'}`}>{value}</span>
    </div>
  );
}

function MissingDataState({ navigate }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/50 p-12 text-center space-y-6">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full blur-xl opacity-50" />
            <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-200">
              <XCircle size={48} className="text-slate-300" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900">Session Not Found</h2>
            <p className="text-slate-500 font-medium">This session data is no longer available. It may have been cleared or expired.</p>
          </div>
          
          <button 
            onClick={() => navigate("/dashboard")}
            className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-indigo-600 hover:to-purple-600 text-white py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 group"
          >
            <Home size={18} />
            Return to Dashboard
            <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}