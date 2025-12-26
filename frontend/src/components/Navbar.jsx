import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  const handleLogoutConfirm = () => {
    logout();
    setShowConfirm(false);
    toastInfo("You have been logged out successfully.");
    navigate("/login");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-gray-900 text-white px-6 py-4 shadow">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            to={isAuthenticated ? "/dashboard" : "/login"}
            className="text-xl font-bold hover:text-indigo-400 transition"
          >
            Interview Prep
          </Link>

          {!isAuthPage && (
            <div className="flex items-center gap-6">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/bookmarks"
                    className="text-sm font-medium hover:text-indigo-400"
                  >
                    Bookmarks
                  </Link>

                  <button
                    onClick={() => setShowConfirm(true)}
                    className="text-sm font-medium text-red-400 hover:text-red-500"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-indigo-400">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="border border-indigo-500 px-4 py-1.5 rounded hover:bg-indigo-500 transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* LOGOUT CONFIRM MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Confirm Logout
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
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
