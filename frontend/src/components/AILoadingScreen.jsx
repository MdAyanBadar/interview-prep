import React, { useState, useEffect } from "react";
import { Loader2, BrainCircuit, Sparkles, ShieldCheck, BarChart3 } from "lucide-react";

const AILoadingScreen = () => {
  const [step, setStep] = useState(0);

  // Rotating messages to keep the user engaged
  const messages = [
    { icon: <BrainCircuit className="text-indigo-500" />, text: "Analyzing technical depth..." },
    { icon: <Sparkles className="text-purple-500" />, text: "Evaluating keyword accuracy..." },
    { icon: <ShieldCheck className="text-emerald-500" />, text: "Validating code syntax..." },
    { icon: <BarChart3 className="text-blue-500" />, text: "Finalizing your score..." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col items-center justify-center p-6 text-center">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-200/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-200/40 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl p-12 shadow-[0_20px_50px_rgba(79,70,229,0.1)] border border-white max-w-lg w-full">
        {/* Main Spinner Core */}
        <div className="relative flex justify-center mb-10">
          <div className="absolute inset-0 scale-150 bg-indigo-100/50 rounded-full animate-ping" />
          <div className="relative bg-gradient-to-tr from-indigo-600 to-purple-600 p-5 rounded-2xl shadow-lg shadow-indigo-200">
            <Loader2 className="w-12 h-12 text-white animate-spin" strokeWidth={2.5} />
          </div>
        </div>

        {/* Dynamic Text Section */}
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Gemini is Grading
          </h2>
          
          <div className="flex items-center justify-center gap-3 h-8 transition-all duration-500 transform">
            {messages[step].icon}
            <span className="text-lg font-medium text-slate-600 italic">
              {messages[step].text}
            </span>
          </div>

          <p className="text-sm text-slate-400 mt-6 max-w-xs mx-auto">
            Our AI is currently reviewing your short-answer responses. This usually takes 5-10 seconds.
          </p>
        </div>

        {/* Animated Progress Bar */}
        <div className="mt-10">
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-loading-bar" />
          </div>
          <div className="flex justify-between mt-3 px-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Processing</span>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">AI Engine Active</span>
          </div>
        </div>
      </div>

      {/* Global CSS for the custom animation */}
      <style>{`
        @keyframes loading-bar {
          0% { width: 0%; transform: translateX(-10%); }
          50% { width: 70%; }
          100% { width: 100%; transform: translateX(0); }
        }
        .animate-loading-bar {
          animation: loading-bar 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AILoadingScreen;