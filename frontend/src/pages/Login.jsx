import { useState } from "react";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toastSuccess, toastError } from "../utils/toast";
import { Eye, EyeOff, Mail, Lock, CheckCircle2 } from "lucide-react"; // Nice icons

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      login(res.data.token);
      toastSuccess("Welcome back! Ready to ace your interview?");
      navigate("/dashboard");
    } catch (err) {
      toastError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-50">
      {/* Left Side: Branding & Features (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-indigo-600 text-white">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-6">Master Your Next Interview.</h1>
          <p className="text-indigo-100 text-lg mb-8">
            Join 5,000+ candidates using our platform to practice real-world questions and get AI-powered feedback.
          </p>

          <ul className="space-y-4">
            {[
              "500+ Industry-specific questions",
              "Real-time AI behavioral analysis",
              "Detailed performance reports",
              "Personalized learning paths",
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle2 className="text-indigo-300 w-5 h-5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Log in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <span className="text-xs text-indigo-600 hover:text-indigo-500 cursor-pointer font-medium">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold shadow-md shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Authenticating...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Social Login (Optional UX improvement) */}
          <div className="mt-8 relative text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
            <span className="relative bg-gray-50 px-4 text-sm text-gray-500">Or continue with</span>
          </div>

          <div className="mt-6 flex gap-4">
             {/* Simple visual placeholders for Google/GitHub */}
            <button className="flex-1 py-2 px-4 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-white transition-colors">
              <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5 mr-2" alt="Google" />
              <span className="text-sm font-medium">Google</span>
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 mt-10">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-indigo-600 font-bold hover:text-indigo-500 transition-colors"
            >
              Start for free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}