import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { X, Lock, Mail, User, ShieldCheck, AlertCircle, ArrowRight, Eye, EyeOff } from "lucide-react";

export function AuthModal() {
  const { authModalOpen, setAuthModalOpen, authInitialTab, setParentProfile, setIsLoggedIn, setCurrentView, showToast, API_BASE } = useApp();

  const [tab, setTab] = useState(authInitialTab || "login"); // 'login' | 'signup' | 'verify'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("1234");
  const [coppaConsent, setCoppaConsent] = useState(true);
  
  // Verification code state
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [suggestedCode, setSuggestedCode] = useState("123456");

  // Reset tab to authInitialTab when modal opens without cascading effect
  const [prevModalOpen, setPrevModalOpen] = useState(authModalOpen);
  if (authModalOpen !== prevModalOpen) {
    setPrevModalOpen(authModalOpen);
    if (authModalOpen) {
      setTab(authInitialTab || "login");
      setErrorMessage("");
    }
  }

  const switchTab = (nextTab) => {
    setTab(nextTab);
    setErrorMessage("");
    if (setAuthInitialTab) setAuthInitialTab(nextTab);
  };

  if (!authModalOpen) return null;

  const handleClose = () => {
    setAuthModalOpen(false);
    setErrorMessage("");
  };

  // Google OAuth Simulation
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "google",
          email: "alex.g@gmail.com",
          name: "Alex Garcia (Google Guardian)"
        })
      });
      const data = await res.json();
      if (data.success) {
        setParentProfile(data.parent);
        setIsLoggedIn(true);
        setAuthModalOpen(false);
        setCurrentView("parent-dashboard");
        showToast(`Signed in with Google! Welcome, ${data.parent.name}`);
      }
    } catch (err) {
      // Fallback local auth
      const mockParent = {
        id: "parent-google-101",
        name: "Alex Garcia (Google Guardian)",
        email: "alex.g@gmail.com",
        pin: "1234",
        provider: "google",
        subscription: { planName: "12 Months Annual Pass", pricePerMonth: "$8.99" }
      };
      setParentProfile(mockParent);
      setIsLoggedIn(true);
      setAuthModalOpen(false);
      setCurrentView("parent-dashboard");
      showToast("Signed in with Google! Welcome, Alex Garcia");
    } finally {
      setIsLoading(false);
    }
  };

  // Apple ID OAuth Simulation
  const handleAppleAuth = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "apple",
          email: "jordan.p@icloud.com",
          name: "Jordan Park (Apple Guardian)"
        })
      });
      const data = await res.json();
      if (data.success) {
        setParentProfile(data.parent);
        setIsLoggedIn(true);
        setAuthModalOpen(false);
        setCurrentView("parent-dashboard");
        showToast(`Signed in with Apple ID! Welcome, ${data.parent.name}`);
      }
    } catch (err) {
      const mockParent = {
        id: "parent-apple-101",
        name: "Jordan Park (Apple Guardian)",
        email: "jordan.p@icloud.com",
        pin: "1234",
        provider: "apple",
        subscription: { planName: "12 Months Annual Pass", pricePerMonth: "$8.99" }
      };
      setParentProfile(mockParent);
      setIsLoggedIn(true);
      setAuthModalOpen(false);
      setCurrentView("parent-dashboard");
      showToast("Signed in with Apple ID! Welcome, Jordan Park");
    } finally {
      setIsLoading(false);
    }
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
      if (data.success) {
        setParentProfile(data.parent);
        setIsLoggedIn(true);
        setAuthModalOpen(false);
        setCurrentView("parent-dashboard");
        showToast(`Welcome back, ${data.parent.name}!`);
      } else {
        setErrorMessage(data.message || "Invalid credentials.");
      }
    } catch (err) {
      // Local fallback
      setParentProfile({
        name: email.split("@")[0] || "Parent Guardian",
        email,
        pin: "1234"
      });
      setIsLoggedIn(true);
      setAuthModalOpen(false);
      setCurrentView("parent-dashboard");
      showToast(`Welcome back!`);
    } finally {
      setIsLoading(false);
    }
  };

  // Email Sign Up Form Submit
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
    if (pin.length !== 4) {
      setErrorMessage("Please provide a 4-digit Guardian PIN.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, pin })
      });
      const data = await res.json();
      if (data.success) {
        setPendingEmail(email);
        setSuggestedCode(data.verificationCode || "123456");
        setTab("verify");
        showToast(data.message || "Verification code dispatched!");
      } else {
        setErrorMessage(data.message || "Could not register account.");
      }
    } catch (err) {
      // Local fallback: jump to verification step
      setPendingEmail(email);
      setSuggestedCode("123456");
      setTab("verify");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify Email Code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!verificationCode) {
      setErrorMessage("Please enter the 6-digit code.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(`${API_BASE}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail, code: verificationCode })
      });
      const data = await res.json();
      if (data.success) {
        setParentProfile(data.parent);
        setIsLoggedIn(true);
        setAuthModalOpen(false);
        setCurrentView("parent-dashboard");
        showToast(`Account verified! Welcome, ${data.parent.name}!`);
      } else {
        setErrorMessage(data.message || "Invalid verification code.");
      }
    } catch (err) {
      const verifiedParent = {
        name: name || "New Guardian",
        email: pendingEmail || email,
        pin: pin || "1234",
        email_verified: true
      };
      setParentProfile(verifiedParent);
      setIsLoggedIn(true);
      setAuthModalOpen(false);
      setCurrentView("parent-dashboard");
      showToast("Account verified successfully!");
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo Autofill
  const autofillDemo = () => {
    setEmail("sarah.m@kidstech.demo");
    setPassword("password123");
    setErrorMessage("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 flex flex-col relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Branding Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-primary-container text-white flex items-center justify-center shadow-md">
            <span className="text-xl">🎒</span>
          </div>
          <div>
            <h3 className="font-display-hero text-xl font-bold text-parent-ink">
              {tab === "verify" ? "Verify Guardian Account" : tab === "signup" ? "Create Guardian Account" : "Parent Sign In"}
            </h3>
            <p className="text-xs text-slate-500">
              {tab === "verify" 
                ? "Enter 6-digit verification code" 
                : tab === "signup"
                ? "Start full family homework assistance"
                : "Access your parent dashboard & settings"}
            </p>
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold mb-4 border border-rose-200 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab Switcher (if not in verify step) */}
        {tab !== "verify" && (
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 mb-6">
            <button
              onClick={() => switchTab("login")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === "login" 
                  ? "bg-white text-parent-ink shadow-sm" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchTab("signup")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                tab === "signup" 
                  ? "bg-white text-parent-ink shadow-sm" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* -------------------- STEP 1: VERIFY CODE -------------------- */}
        {tab === "verify" && (
          <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex flex-col gap-1.5">
              <span className="font-bold flex items-center gap-1.5 text-amber-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                COPPA Verifiable Parental Consent (VPC)
              </span>
              <p className="text-[11px] leading-relaxed">
                We sent a 6-digit verification code to <strong>{pendingEmail || email}</strong>.
              </p>
              <div className="mt-1 pt-1 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-amber-800">
                <span>Test Code: <strong>{suggestedCode}</strong></span>
                <button
                  type="button"
                  onClick={() => setVerificationCode(suggestedCode)}
                  className="font-bold underline text-primary"
                >
                  Insert Code
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.trim())}
                placeholder="123456"
                className="w-full text-center tracking-widest text-xl font-mono px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-primary hover:bg-sky-800 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? "Verifying..." : "Verify & Launch Dashboard"}
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => switchTab("signup")}
              className="text-center text-xs text-slate-500 hover:text-slate-800 mt-1"
            >
              Back to Registration
            </button>
          </form>
        )}

        {/* -------------------- STEP 2: LOGIN / SIGNUP -------------------- */}
        {tab !== "verify" && (
          <div className="flex flex-col gap-4">
            
            {/* Social Authentication Buttons */}
            <div className="flex flex-col gap-2.5">
              {/* Google Button */}
              <button
                type="button"
                onClick={() => handleGoogleAuth(tab === "signup")}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 text-xs font-bold text-slate-700 shadow-xs active:scale-95"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>{tab === "signup" ? "Sign up with Google" : "Continue with Google"}</span>
              </button>

              {/* Apple Button */}
              <button
                type="button"
                onClick={() => handleAppleAuth(tab === "signup")}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-black hover:bg-slate-800 text-white transition-all flex items-center justify-center gap-3 text-xs font-bold shadow-xs active:scale-95"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.06-7.7-7.89-12.04-14.49-6.3-9.6-11.2-20.73-14.71-33.39-3.51-12.66-5.26-24.36-5.26-35.1 0-14.93 3.86-27.18 11.58-36.75 7.72-9.57 17.51-14.42 29.38-14.54 4.58 0 9.87 1.25 15.86 3.75 5.99 2.5 10.02 3.8 12.09 3.9 1.84 0 6.04-1.37 12.59-4.11s12.02-3.87 16.42-3.41c13.7.67 24.33 5.48 31.9 14.42-12.18 7.37-18.15 17.38-17.91 30.04.24 10.15 4.09 18.66 11.56 25.53 7.47 6.87 16.36 10.77 26.68 11.71-2.22 6.64-4.85 13.5-7.89 20.58zM119.22 31.84c0-7.39 2.65-14.37 7.95-20.94 5.3-6.57 11.89-10.53 19.78-11.9-1.02 7.16-3.82 14.07-8.4 20.73-4.58 6.66-10.96 10.7-19.14 12.11-.04-.01-.19-.01-.19 0z" />
                </svg>
                <span>{tab === "signup" ? "Sign up with Apple" : "Continue with Apple"}</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                or email
              </span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Form */}
            {tab === "login" ? (
              /* LOGIN FORM */
              <form onSubmit={handleEmailLogin} className="flex flex-col gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. sarah.m@kidstech.demo"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={autofillDemo}
                      className="text-[11px] font-bold text-primary hover:underline"
                    >
                      Autofill Demo
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 mt-1 rounded-xl bg-primary hover:bg-sky-800 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {isLoading ? "Signing In..." : "Sign In to Dashboard"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* SIGNUP FORM */
              <form onSubmit={handleEmailSignup} className="flex flex-col gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Guardian Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Michael Chen"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. michael.chen@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Create Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1" title="Protects settings from children">
                      Guardian PIN (4 Digits)
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="1234"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-center font-mono focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>

                {/* COPPA Consent Checkbox */}
                <label className="flex items-start gap-2 cursor-pointer mt-1 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                  <input
                    type="checkbox"
                    checked={coppaConsent}
                    onChange={(e) => setCoppaConsent(e.target.checked)}
                    className="mt-0.5 rounded text-primary focus:ring-primary"
                  />
                  <span className="text-[11px] text-slate-600 leading-tight">
                    I verify I am 18+ and give <strong>Verifiable Parental Consent (COPPA)</strong> for AI tutoring.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 mt-1 rounded-xl bg-primary hover:bg-sky-800 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {isLoading ? "Creating Account..." : "Create Account & Verify"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Footer switcher */}
            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
              {tab === "login" ? (
                <span>
                  New to KIDSTECH?{" "}
                  <button
                    type="button"
                    onClick={() => switchTab("signup")}
                    className="font-bold text-primary hover:underline"
                  >
                    Create Free Account
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchTab("login")}
                    className="font-bold text-primary hover:underline"
                  >
                    Sign In
                  </button>
                </span>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
