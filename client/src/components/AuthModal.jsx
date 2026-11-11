import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle2
} from "lucide-react";

export function AuthModal() {
  const {
    authModalOpen,
    setAuthModalOpen,
    authInitialTab,
    login,
    loginAsRole,
    API_BASE,
    showToast
  } = useApp();

  const [tab, setTab] = useState(authInitialTab || "login"); // 'login' | 'signup' | 'demo'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("parent"); // 'student' | 'parent' | 'teacher' | 'admin'
  const [school, setSchool] = useState("");
  const [subject, setSubject] = useState("");
  const [pin, setPin] = useState("1234");
  const [coppaConsent, setCoppaConsent] = useState(true);

  if (!authModalOpen) return null;

  const handleClose = () => {
    setAuthModalOpen(false);
    setErrorMessage("");
  };

  const handleDemoSelect = (selectedRole) => {
    loginAsRole(selectedRole);
    setAuthModalOpen(false);
  };

  // Email / Password Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        login(data.user);
        setAuthModalOpen(false);
      } else {
        setErrorMessage(data.message || "Invalid credentials.");
      }
    } catch (err) {
      // Local fallback
      const fallbackUser = {
        id: `usr-${Date.now()}`,
        name: email.split("@")[0] || "User",
        email,
        role: email.includes("admin") ? "admin" : email.includes("teacher") ? "teacher" : email.includes("student") ? "student" : "parent",
        pin: "1234"
      };
      login(fallbackUser);
      setAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Up Form Submit
  const handleEmailSignup = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setErrorMessage("Please fill out your name and email.");
      return;
    }
    if (!coppaConsent) {
      setErrorMessage("Please check the COPPA parental consent box to continue.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password: password || "password123",
          pin: pin || "1234",
          role,
          school,
          subject
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        login(data.user);
        setAuthModalOpen(false);
      } else {
        setErrorMessage(data.message || "Could not register account.");
      }
    } catch (err) {
      // Local fallback
      const newUser = {
        id: `usr-${Date.now()}`,
        name,
        email,
        role,
        pin: pin || "1234",
        school,
        subject
      };
      login(newUser);
      setAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative animate-scaleUp">
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-primary-container text-white flex items-center justify-center text-xl shadow-md">
            🎒
          </div>
          <div>
            <h3 className="font-display-hero text-xl font-bold text-slate-900">
              KIDS<span className="text-primary-container">TECH</span>
            </h3>
            <p className="text-[11px] text-slate-500 font-semibold">
              Homework Bridge & Study Assistant
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl mb-6 text-xs font-bold">
          <button
            onClick={() => {
              setTab("login");
              setErrorMessage("");
            }}
            className={`py-2 rounded-xl transition-all ${
              tab === "login" ? "bg-white text-slate-900 shadow-xs font-extrabold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => {
              setTab("signup");
              setErrorMessage("");
            }}
            className={`py-2 rounded-xl transition-all ${
              tab === "signup" ? "bg-white text-slate-900 shadow-xs font-extrabold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => {
              setTab("demo");
              setErrorMessage("");
            }}
            className={`py-2 rounded-xl transition-all ${
              tab === "demo" ? "bg-white text-indigo-700 shadow-xs font-extrabold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Demo Roles ✨
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-700 flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* TAB 1: LOGIN */}
        {tab === "login" && (
          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="e.g. sarah.m@kidstech.demo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 bg-primary-container hover:bg-sky-500 text-white font-bold text-xs rounded-2xl shadow-md transition-all active:scale-95"
            >
              {isLoading ? "Signing In..." : "Sign In to Dashboard"}
            </button>
          </form>
        )}

        {/* TAB 2: SIGN UP */}
        {tab === "signup" && (
          <form onSubmit={handleEmailSignup} className="flex flex-col gap-3 text-xs max-h-[460px] overflow-y-auto pr-1">
            <div>
              <label className="font-bold text-slate-700 block mb-1">I am registering as a:</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="student">Student (Grade 1–12)</option>
                <option value="parent">Parent / Guardian</option>
                <option value="teacher">Teacher / Educator</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah Miller"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {role === "teacher" && (
              <>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">School Affiliation</label>
                  <input
                    type="text"
                    placeholder="e.g. Lincoln Elementary School"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Grade / Subject Taught</label>
                  <input
                    type="text"
                    placeholder="e.g. 5th Grade STEM & Math"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </>
            )}

            {role === "parent" && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">4-Digit Parent PIN (Protects Final Answers)</label>
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="1234"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm tracking-widest font-bold"
                />
              </div>
            )}

            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="coppaConsent"
                checked={coppaConsent}
                onChange={(e) => setCoppaConsent(e.target.checked)}
                className="mt-0.5 rounded text-sky-600 focus:ring-sky-500"
              />
              <label htmlFor="coppaConsent" className="text-[11px] text-slate-600 leading-tight">
                I agree to the COPPA Privacy Policy and Terms. No student homework is sold or shared with advertisers.
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-primary hover:bg-sky-800 text-white font-bold text-xs rounded-2xl shadow-md transition-all active:scale-95"
            >
              {isLoading ? "Creating Account..." : `Complete ${role.toUpperCase()} Registration`}
            </button>
          </form>
        )}

        {/* TAB 3: DEMO ROLES (One-click instant login for testing) */}
        {tab === "demo" && (
          <div className="flex flex-col gap-2.5 animate-fadeIn">
            <p className="text-xs text-slate-500 mb-2">
              Select any role to immediately test their dedicated portal and verified features:
            </p>

            <button
              onClick={() => handleDemoSelect("student")}
              className="p-3.5 rounded-2xl border-2 border-sky-200 hover:border-sky-500 bg-sky-50/70 text-left flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎒</span>
                <div>
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">Student Portal (Emma, Grade 3)</div>
                  <div className="text-[11px] text-slate-500">Homework submission, hints & mini quizzes</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-sky-600 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleDemoSelect("parent")}
              className="p-3.5 rounded-2xl border-2 border-emerald-200 hover:border-emerald-500 bg-emerald-50/70 text-left flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛡️</span>
                <div>
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">Parent Portal (Sarah Miller)</div>
                  <div className="text-[11px] text-slate-500">PIN management, screen time limits & diagnostics</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleDemoSelect("teacher")}
              className="p-3.5 rounded-2xl border-2 border-blue-200 hover:border-blue-500 bg-blue-50/70 text-left flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">👨‍🏫</span>
                <div>
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">Teacher Portal (Mr. Robert Davis)</div>
                  <div className="text-[11px] text-slate-500">Submissions review, guidance notes & reports</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="pt-3 border-t border-slate-200 mt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Restricted Project Owner Access
              </span>
              <button
                onClick={() => handleDemoSelect("admin")}
                className="w-full p-2.5 rounded-xl border border-purple-200 hover:border-purple-400 bg-purple-50/50 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">⚙️</span>
                  <div>
                    <div className="font-bold text-slate-800 text-xs">Project Owner / Admin (Eleanor Vance)</div>
                    <div className="text-[10px] text-slate-500">Manage all accounts, teachers, verifications & payments</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-purple-600 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AuthModal;
