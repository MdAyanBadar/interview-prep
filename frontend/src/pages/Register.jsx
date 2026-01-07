import { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { toastSuccess, toastError } from "../utils/toast";
import { User, Mail, Lock, ShieldCheck, Rocket, Zap, Star } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerUser({ name, email, password });
      toastSuccess("Account created! Let's get you logged in.");
      navigate("/login");
    } catch (err) {
      toastError(err.response?.data?.message || "Registration failed. Use a different email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-50">
      {/* Left Side: Onboarding Content */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-indigo-600 text-white relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-500 rounded-full opacity-50 blur-3xl"></div>

        <div className="relative z-10 max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-6">Your Journey to a Big Tech Job Starts Here.</h1>
          
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="bg-indigo-500 p-3 rounded-lg h-fit">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-xl">Quick Onboarding</h3>
                <p className="text-indigo-100">Set up your profile and start practicing in less than 2 minutes.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-indigo-500 p-3 rounded-lg h-fit">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-xl">AI-Driven Insights</h3>
                <p className="text-indigo-100">Get instant feedback on your answers and body language.</p>
              </div>
            </div>

            {/* Testimonial Mini-Card */}
            <div className="mt-12 bg-indigo-700/50 p-6 rounded-2xl border border-indigo-400/30 backdrop-blur-sm">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="italic text-indigo-50 text-sm mb-4">
                "This platform helped me land my Senior Dev role at Meta. The mock sessions felt incredibly real."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center font-bold">JD</div>
                <div>
                  <p className="font-bold text-sm">Jane Doe</p>
                  <p className="text-xs text-indigo-200">Software Engineer @ Meta</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Registration Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create your account</h2>
            <p className="text-gray-600 mt-2">Join thousands of candidates worldwide.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Ayan Badar"
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Create Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Min. 8 characters"
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                <ShieldCheck size={14} className="text-green-500" />
                Password must be at least 8 characters long.
              </p>
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Setting up your profile...
                </div>
              ) : (
                "Create Free Account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-8">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-indigo-600 font-bold hover:text-indigo-500 transition-colors"
            >
              Log in here
            </button>
          </p>

          <p className="mt-10 text-center text-xs text-gray-400">
            By signing up, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}