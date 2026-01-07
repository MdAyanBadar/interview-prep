import React from "react";
import { Loader2, LayoutGrid, BookmarkCheck, Zap, Settings, User } from "lucide-react";

const PageLoader = ({ loadingKey = "default" }) => {
  // Configuration for different page types
  const configs = {
    dashboard: {
      icon: <LayoutGrid className="text-indigo-600" size={32} />,
      text: "Syncing Dashboard",
      subtext: "Fetching your latest progress...",
      color: "from-indigo-600 to-blue-500"
    },
    bookmarks: {
      icon: <BookmarkCheck className="text-emerald-600" size={32} />,
      text: "Retrieving Bookmarks",
      subtext: "Organizing your saved questions...",
      color: "from-emerald-500 to-teal-500"
    },
    practice: {
      icon: <Zap className="text-purple-600" size={32} />,
      text: "Preparing Session",
      subtext: "Assembling technical questions...",
      color: "from-purple-600 to-pink-500"
    },
    profile: {
      icon: <User className="text-slate-600" size={32} />,
      text: "Loading Profile",
      subtext: "Getting your account details...",
      color: "from-slate-700 to-slate-900"
    },
    default: {
      icon: <Loader2 className="text-indigo-600 animate-spin" size={32} />,
      text: "Loading",
      subtext: "Just a moment...",
      color: "from-indigo-500 to-purple-600"
    }
  };

  const active = configs[loadingKey] || configs.default;

  return (
    <div className="fixed inset-0 z-[999] bg-white flex flex-col items-center justify-center animate-out fade-out slide-out-to-top duration-700 delay-500">
      
      {/* Top Animated Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-50 overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${active.color} animate-loading-bar`} />
      </div>

      <div className="flex flex-col items-center text-center px-6">
        {/* Animated Icon Container */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-slate-100 rounded-3xl rotate-6 animate-pulse" />
          <div className="relative z-10 bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            {active.icon}
          </div>
        </div>

        {/* Dynamic Typography */}
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
          {active.text}
        </h2>
        <p className="text-slate-500 font-medium italic text-sm">
          {active.subtext}
        </p>

        {/* Bottom Loading Indicator */}
        <div className="mt-10 flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-indigo-200 animate-bounce" />
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 100%; transform: translateX(0%); }
          100% { width: 0%; transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default PageLoader;