import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { submitSession } from "../api/sessions";
import QuestionCard from "../components/QuestionCard";
import { 
  ChevronLeft, ChevronRight, Send, Timer, ListChecks, 
  Loader2, AlertCircle, CheckCircle2, Circle, Zap, TrendingUp 
} from "lucide-react";
import { toastError } from "../utils/toast";
import AILoadingScreen from "../components/AILoadingScreen";

export default function Practice() {
  const { state: questions } = useLocation();
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState({});
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      if (!loading) handleSubmit(true); 
      return;
    }
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [timeLeft, loading]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const totalQuestions = questions?.length || 0;
  const progress = useMemo(() => ((Object.keys(answers).length / totalQuestions) * 100), [answers, totalQuestions]);

  /**
   * UPDATED: handleAnswer
   * Detects if the value is from a button click (MCQ) or textarea change (Event)
   */
  const handleAnswer = (questionId, rawValue) => {
    const finalValue = (rawValue && rawValue.target) ? rawValue.target.value : rawValue;
    
    setAnswers(prev => ({ 
      ...prev, 
      [questionId]: finalValue 
    }));
  };

  /**
   * UPDATED: handleSubmit
   * Ensures every value is converted to a string before sending to backend
   */
  const handleSubmit = async (isAutoSubmit = false) => {
    if (loading) return <PageLoader loadingKey="practice"/>;
  
    const answeredCount = Object.keys(answers).length;
    if (!isAutoSubmit && timeLeft > 0 && answeredCount < totalQuestions) {
      if (!window.confirm(`You've only answered ${answeredCount}/${totalQuestions}. Submit?`)) return;
    }
  
    setLoading(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([qId, val]) => ({
        questionId: qId,
        userAnswer: val !== undefined && val !== null ? String(val) : ""
      }));
  
      const res = await submitSession(sessionId, formattedAnswers);
      
      navigate(`/results/${sessionId}`, { 
        state: {
          score: res.data.score,
          total: totalQuestions,
          accuracy: Math.round((res.data.score / totalQuestions) * 100),
          results: res.data.answers,
          topicStats: {}
        } 
      });
    } catch (err) {
      console.error("Submission Error:", err);
      toastError("Submission failed. Check your internet connection.");
      setLoading(false); 
    }
  };

  if (!questions || totalQuestions === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40 p-6">
        <div className="bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-2xl shadow-indigo-200/50 text-center max-w-md border border-white/60">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-6">
            <AlertCircle className="text-amber-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">No Questions Found</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">We couldn't find any questions for this session. Please try again.</p>
          <button 
            onClick={() => navigate("/dashboard")} 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <AILoadingScreen />
    );
  }

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex flex-col lg:flex-row">
      
      {/* --- SIDEBAR --- */}
      <div className="hidden lg:flex w-96 bg-white/95 backdrop-blur-xl border-r border-slate-200/60 p-8 flex-col sticky top-0 h-screen shadow-xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-indigo-100 rounded-xl">
              <ListChecks className="text-indigo-600" size={24} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Question Map</h2>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3 overflow-y-auto mb-8 pr-2">
          {questions.map((q, idx) => {
            // UPDATED: Proper check for "0" index MCQ answer
            const isAnswered = answers[q._id] !== undefined && answers[q._id] !== "";
            const isCurrent = currentIndex === idx;
            
            return (
              <button
                key={q._id}
                onClick={() => setCurrentIndex(idx)}
                className={`relative group w-full aspect-square rounded-2xl text-sm font-bold transition-all ${
                  isCurrent 
                    ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg ring-4 ring-indigo-200" 
                    : isAnswered 
                    ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-200" 
                    : "bg-slate-50 text-slate-400 border-2 border-slate-200"
                }`}
              >
                <span className="relative z-10">{idx + 1}</span>
              </button>
            );
          })}
        </div>
        
        <div className="mt-auto space-y-6">
          <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl p-5 border border-slate-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{answeredCount}</div>
                <div className="text-xs text-slate-500 font-medium uppercase">Answered</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{totalQuestions - answeredCount}</div>
                <div className="text-xs text-slate-500 font-medium uppercase">Left</div>
              </div>
            </div>
          </div>

          <div className={`rounded-2xl p-5 border-2 transition-all ${timeLeft < 60 ? 'bg-red-50 border-red-200 animate-pulse' : 'bg-emerald-50 border-emerald-200'}`}>
            <div className="flex items-center gap-3">
              <Timer size={20} className={timeLeft < 60 ? 'text-red-700' : 'text-emerald-700'} />
              <div className={`text-2xl font-extrabold ${timeLeft < 60 ? 'text-red-700' : 'text-emerald-700'}`}>
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-tight">{Math.round(progress)}% Completed</p>
          </div>
        </div>
      </div>

      {/* --- MAIN INTERFACE --- */}
      <div className="flex-grow flex flex-col items-center p-4 md:p-12 overflow-y-auto">
        <div className="w-full max-w-4xl flex flex-col h-full">
          
          <div className="flex justify-between items-center mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-slate-900 rounded-xl text-white font-bold text-lg">
                {currentIndex + 1}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {currentQ.type === 'mcq' ? 'Knowledge Check' : 'Technical Analysis'}
                </h1>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{currentQ.topic}</span>
              </div>
            </div>
          </div>

          <div className="flex-grow mb-8">
            <QuestionCard
              key={currentQ._id}
              question={currentQ}
              onAnswer={(val) => handleAnswer(currentQ._id, val)}
              initialAnswer={answers[currentQ._id] ?? ""} 
              bookmarked={bookmarkedQuestions[currentQ._id]}
              onBookmark={() =>
                setBookmarkedQuestions(prev => ({
                  ...prev,
                  [currentQ._id]: !prev[currentQ._id]
                }))
              }
            />
          </div>

          <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/60">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-6 py-3 font-bold text-slate-600 disabled:opacity-20"
              >
                <ChevronLeft size={20} /> Previous
              </button>

              {currentIndex === totalQuestions - 1 ? (
                <button
                  onClick={() => handleSubmit(false)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-95"
                >
                  <Send size={20} className="inline mr-2" /> Finish Assessment
                </button>
              ) : (
                <button
                  onClick={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                  className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-bold shadow-xl transition-all"
                >
                  Next Question <ChevronRight size={20} className="inline ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}