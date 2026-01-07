import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { LogOut, Bookmark, LayoutDashboard, User, LogIn, Sparkles, BookmarkCheck, LayoutGrid } from "lucide-react";
import { toastInfo } from "../utils/toast";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  const handleLogoutConfirm = () => {
    logout();
    setShowConfirm(false);
    toastInfo("Logged out successfully.");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* LOGO */}
            <Link
              to={isAuthenticated ? "/dashboard" : "/"}
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-base shadow-lg group-hover:scale-105 transition-transform">
                  IP
                </div>
              </div>
              <span className="hidden sm:block text-xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-purple-600 transition-all">
                InterviewPrep
              </span>
            </Link>

            {!isAuthPage && (
              <div className="flex items-center gap-2">
                {isAuthenticated ? (
                  <>
                    {/* Navigation Links */}
                    <div className="flex items-center gap-1 bg-slate-100/80 rounded-2xl p-1">
                      <Link
                        to="/dashboard"
                        className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                          isActive("/dashboard")
                            ? "bg-white text-indigo-600 shadow-md"
                            : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                        }`}
                      >
                        <LayoutGrid size={18} />
                        <span className="hidden md:block">Dashboard</span>
                        {isActive("/dashboard") && (
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl" />
                        )}
                      </Link>

                      <Link
                        to="/bookmarks"
                        className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                          isActive("/bookmarks")
                            ? "bg-white text-indigo-600 shadow-md"
                            : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                        }`}
                      >
                        <BookmarkCheck size={18} />
                        <span className="hidden md:block">Bookmarks</span>
                        {isActive("/bookmarks") && (
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl" />
                        )}
                      </Link>
                    </div>

                    {/* Divider */}
                    <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block" />

                    {/* Logout Button */}
                    <button
                      onClick={() => setShowConfirm(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all group"
                    >
                      <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                      <span className="hidden md:block">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                    >
                      <LogIn size={18} />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/register"
                      className="relative group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity" />
                      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2 group-hover:scale-105 active:scale-95">
                        <Sparkles size={16} />
                        <span>Get Started</span>
                      </div>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* MODAL: LOGOUT CONFIRMATION */}
      {showConfirm && (
        <div 
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
          onClick={() => setShowConfirm(false)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative bg-gradient-to-br from-red-50 via-white to-orange-50 p-8 text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full blur-3xl opacity-50" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-100 rounded-full blur-2xl opacity-50" />
              
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-red-200 animate-pulse">
                  <LogOut size={36} className="text-white" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-3">
                  Signing Out?
                </h2>
                <p className="text-slate-600 text-base leading-relaxed max-w-xs mx-auto">
                  You'll need to log back in to continue your practice sessions and track your progress.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-slate-50 p-5 flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-5 py-3.5 rounded-2xl font-bold text-slate-700 bg-white hover:bg-slate-100 border-2 border-slate-200 hover:border-slate-300 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
              >
                Stay Logged In
              </button>

              <button
                onClick={handleLogoutConfirm}
                className="flex-1 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold hover:from-red-700 hover:to-orange-700 shadow-lg shadow-red-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}