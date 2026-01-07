import { useState, useEffect } from "react";
import { startSession } from "../api/sessions";
import { useNavigate } from "react-router-dom";
import { toastSuccess, toastError } from "../utils/toast";
import { 
  BookOpen, BarChart3, ListOrdered, Play, ArrowLeft, 
  Zap, Target, Clock, Sparkles, X, ChevronRight, Loader2,
  Layers, CheckSquare, MessageSquare
} from "lucide-react";

const SUGGESTED_TOPICS = ["JavaScript", "React", "Node.js", "System Design", "Behavioral"];

export default function StartPractice() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [sessionType, setSessionType] = useState("mixed"); // New: mixed, mcq, short-answer
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !loading && (topic || e.ctrlKey)) {
        handleStart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [topic, difficulty, limit, loading, sessionType]);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await startSession({
        topic: topic || undefined,
        difficulty,
        limit,
        type: sessionType // Passing the session type to backend
      });
      toastSuccess("Your session is ready. Good luck!");
      navigate(`/practice/${res.data.sessionId}`, {
        state: res.data.questions
      });
    } catch (err) {
      toastError(err.response?.data?.message || "No questions found for these criteria.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-200/40 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-5xl relative z-10">
        <button 
          onClick={() => navigate("/dashboard")}
          className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-8 transition-all"
        >
          <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow group-hover:bg-indigo-50 transition-all">
            <ArrowLeft size={18} />
          </div>
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(79,70,229,0.1)] overflow-hidden border border-slate-100">
          <div className="flex flex-col lg:flex-row">
            
            <div className="flex-[1.4] p-8 md:p-12 space-y-10">
              <header>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest mb-4">
                  <Sparkles size={14} /> Hybrid Assessment
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                  Practice <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Smarter.</span>
                </h1>
                <p className="text-slate-500 font-medium">Configure your interview simulation environment.</p>
              </header>

              {/* NEW: Session Type Selector */}
              <section>
                <Label icon={Layers} title="Session Mode" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: "mixed", icon: Layers, label: "Balanced Mix", desc: "MCQs + AI Analysis" },
                    { id: "mcq", icon: CheckSquare, label: "Fast MCQ", desc: "Instant Knowledge Check" },
                    { id: "short-answer", icon: MessageSquare, label: "AI Deep Dive", desc: "Verbal & Written Skills" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSessionType(item.id)}
                      className={`p-4 rounded-2xl border-2 transition-all text-left group ${
                        sessionType === item.id 
                        ? "border-indigo-600 bg-indigo-50/50 shadow-md shadow-indigo-100" 
                        : "border-slate-100 hover:border-slate-200 bg-white"
                      }`}
                    >
                      <div className={`p-2 w-fit rounded-lg mb-3 ${sessionType === item.id ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400 group-hover:text-indigo-500"}`}>
                        <item.icon size={18} />
                      </div>
                      <p className={`font-bold text-sm ${sessionType === item.id ? "text-slate-900" : "text-slate-500"}`}>{item.label}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <Label icon={BookOpen} title="Domain" badge="Optional" />
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search topic (e.g. React, System Design)..."
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    className="w-full bg-slate-50/50 px-6 py-4 rounded-2xl border-2 border-slate-100 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-slate-800 font-semibold"
                  />
                  {topic && (
                    <button onClick={() => setTopic("")} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full transition-colors">
                      <X size={16} className="text-slate-400" />
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {SUGGESTED_TOPICS.map(t => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        topic === t 
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200" 
                        : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section>
                  <Label icon={BarChart3} title="Difficulty" />
                  <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                    {["easy", "medium", "hard"].map((level) => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                          difficulty === level 
                          ? "bg-white text-slate-900 shadow-sm" 
                          : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <Label icon={Clock} title="Quantity" />
                  <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                    {[5, 10, 15, 20].map((val) => (
                      <button
                        key={val}
                        onClick={() => setLimit(val)}
                        className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all ${
                          limit === val 
                          ? "bg-white text-indigo-600 shadow-sm" 
                          : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        {val} Qs
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            {/* Right Column: Sticky Summary */}
            <div className="flex-1 bg-slate-50/80 backdrop-blur-sm p-8 md:p-12 lg:border-l border-slate-100 flex flex-col justify-between border-t lg:border-t-0">
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                  <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                    <ListOrdered size={20} className="text-indigo-600" /> Session Setup
                  </h3>
                  
                  <div className="space-y-4">
                    <SummaryItem label="Mode" value={sessionType} icon={Layers} capitalize />
                    <SummaryItem label="Domain" value={topic || "All Domains"} icon={BookOpen} />
                    <SummaryItem label="Level" value={difficulty} icon={Zap} capitalize />
                    <SummaryItem label="Estim. Time" value={`${limit * (sessionType === 'mcq' ? 1 : 2.5)} Minutes`} icon={Clock} />
                  </div>
                </div>

                <div className="px-4 py-3 bg-indigo-600/5 rounded-2xl border border-indigo-100 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <p className="text-xs font-bold text-indigo-700">
                    {sessionType === 'mcq' ? 'Instant grading active' : 'AI Analysis engine standby'}
                  </p>
                </div>
              </div>

              <div className="mt-12 space-y-4">
                <button
                  onClick={handleStart}
                  disabled={loading}
                  className="w-full relative group bg-slate-900 hover:bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 overflow-hidden"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <span>Generate Assessment</span>
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ icon: Icon, title, badge }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
          <Icon size={16} strokeWidth={2.5} />
        </div>
        <span className="text-sm font-black text-slate-700 uppercase tracking-wider">{title}</span>
      </div>
      {badge && <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{badge}</span>}
    </div>
  );
}

function SummaryItem({ label, value, icon: Icon, capitalize }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-2 text-slate-400 group-hover:text-indigo-500 transition-colors">
        <Icon size={14} />
        <span className="text-xs font-bold uppercase tracking-tight">{label}</span>
      </div>
      <span className={`text-sm font-black text-slate-800 ${capitalize ? 'capitalize' : ''}`}>{value}</span>
    </div>
  );
}