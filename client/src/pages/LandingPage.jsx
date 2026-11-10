import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Sparkles,
  Shield,
  ArrowRight,
  CheckCircle2,
  Star,
  BookOpen,
  Brain,
  Users,
  Award,
  FileText,
  Check,
  Lock,
  MessageSquare,
  HelpCircle,
  Mail,
  Send,
  GraduationCap,
  Heart,
  ChevronRight,
  DollarSign
} from "lucide-react";

export function LandingPage() {
  const {
    setCurrentView,
    setMode,
    isLoggedIn,
    currentUser,
    userRole,
    loginAsRole,
    openLoginModal,
    openSignupModal,
    showToast
  } = useApp();

  const [activeBenefitTab, setActiveBenefitTab] = useState("students"); // 'students' | 'parents' | 'teachers'

  // Family per-kid pricing calculator state (Requirement: $8 for 1 kid, +50% ($4) per additional kid)
  const [pricingKids, setPricingKids] = useState(2); // default 2 kids ($12/mo)
  const [billingCycle, setBillingCycle] = useState("annual"); // 'annual' | 'monthly'

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactRole, setContactRole] = useState("parent");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      showToast("Please fill in all contact fields.", "error");
      return;
    }
    setContactSubmitted(true);
    showToast("Message sent! A KidsTech academic specialist will follow up shortly.", "success");
    setContactName("");
    setContactEmail("");
    setContactMessage("");
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-800">

      {/* QUICK ROLE DEMO BAR (One-click role tester for evaluations) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-2.5 px-4 text-xs">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-amber-300">KidsTech Multi-Role Evaluation:</span>
            <span className="text-slate-300 hidden md:inline">Test authentication flow & portals for all 4 user types:</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => loginAsRole("student")}
              className="px-3 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 font-bold text-[11px] transition-all"
            >
              Student Portal (Emma)
            </button>
            <button
              onClick={() => loginAsRole("parent")}
              className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 font-bold text-[11px] transition-all"
            >
              Parent Portal (Sarah)
            </button>
            <button
              onClick={() => loginAsRole("teacher")}
              className="px-3 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-400/30 font-bold text-[11px] transition-all"
            >
              Teacher Portal (Mr. Davis)
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-8 max-w-[1280px] mx-auto">
        {/* Subtle decorative blurred blobs */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-sky-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-24 right-1/4 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 pt-6">
          <div className="flex flex-col gap-6 max-w-xl text-left">
            <div className="inline-flex items-center gap-2 bg-sky-100 border border-sky-200 text-sky-900 px-3.5 py-1.5 rounded-full text-xs font-bold w-fit shadow-sm">
              <Sparkles className="w-4 h-4 text-primary-container" />
              <span>AI-Powered K–12 Study Assistant & Homework Bridge</span>
            </div>

            <h1 className="font-headline-parent-lg text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-parent-ink tracking-tight leading-[1.12]">
              Teach first, answer last. <br />
              <span className="text-primary-container underline decoration-amber-400 decoration-4 underline-offset-8">
                Homework help that builds real understanding.
              </span>
            </h1>

            <p className="font-body-parent-md text-base sm:text-lg text-slate-600 leading-relaxed">
              KidsTech is the affordable AI tutor that breaks down homework step-by-step with progressive hints, mini-quizzes, and <strong>Parent PIN Protection</strong> — preventing blind answer copying while giving parents and teachers complete visibility.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  setMode("kid");
                  setCurrentView("kids-switcher");
                }}
                className="px-8 py-4 rounded-2xl bg-primary-container hover:bg-sky-500 text-white font-display-hero text-lg font-bold shadow-[0_6px_0_0_#004c69] active:shadow-[0_1px_0_0_#004c69] active:translate-y-[5px] transition-all flex items-center gap-3"
              >
                <span>Try Demo as Student</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {isLoggedIn ? (
                <button
                  onClick={() => {
                    if (userRole === "admin") setCurrentView("admin-dashboard");
                    else if (userRole === "teacher") setCurrentView("teacher-dashboard");
                    else if (userRole === "student") setCurrentView("kids-switcher");
                    else setCurrentView("parent-dashboard");
                  }}
                  className="px-7 py-4 rounded-2xl bg-white hover:bg-slate-100 text-parent-ink border-2 border-slate-200 font-headline-parent-md text-base font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  <span>Open {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : "User"} Dashboard</span>
                </button>
              ) : (
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={openSignupModal}
                    className="px-7 py-4 rounded-2xl bg-primary hover:bg-sky-800 text-white font-headline-parent-md text-base font-bold transition-all shadow-md active:scale-95 flex items-center gap-2"
                  >
                    <span>Sign Up Free</span>
                  </button>

                  <button
                    onClick={openLoginModal}
                    className="px-6 py-4 rounded-2xl bg-white hover:bg-slate-100 text-parent-ink border-2 border-slate-200 font-headline-parent-md text-sm font-bold transition-all shadow-sm"
                  >
                    <span>Log In</span>
                  </button>
                </div>
              )}
            </div>

            {/* Micro Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>COPPA Safe & Compliant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-500" />
                <span>Parent PIN Gate (No Cheating)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-sky-600" />
                <span>Common Core & NGSS Aligned</span>
              </div>
            </div>
          </div>

          {/* Interactive Live Sample Card */}
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200/80 relative">
            <div className="absolute -top-3.5 -right-3.5 bg-parent-accent text-white px-3.5 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Socratic Learning Flow</span>
            </div>

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">
                🐻
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-display-hero text-lg font-bold text-slate-900">Emma</h4>
                  <span className="text-xs bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">Grade 3 Math</span>
                </div>
                <p className="text-xs text-slate-500">Topic: Two-digit addition with regrouping</p>
              </div>
            </div>

            {/* Simulated Socratic Step */}
            <div className="flex flex-col gap-3 text-xs">
              <div className="bg-sky-50 border border-sky-200 p-3.5 rounded-2xl">
                <span className="font-bold text-sky-900 block mb-0.5">What is this homework asking?</span>
                <p className="text-slate-700">"Add 28 + 19 using place-value column regrouping."</p>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl">
                <span className="font-bold text-amber-900 block mb-0.5">Step 1: Line up the columns & add ones</span>
                <p className="text-slate-700">8 + 9 = 17 ➜ Write 7, carry 1 ten to the tens roof!</p>
              </div>

              <div className="bg-purple-50 border border-purple-200 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-purple-900 block mb-0.5">Final Solution Gate</span>
                  <span className="text-[11px] text-purple-700">Protected by 4-digit Parent PIN</span>
                </div>
                <span className="px-3 py-1 bg-white text-purple-900 font-mono font-bold rounded-xl border border-purple-200 text-xs shadow-xs">
                  🔒 PIN Locked
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>98% of parents report reduced homework tears</span>
              <span className="font-bold text-emerald-600">✓ Learning verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM BENEFITS: FOR STUDENTS, FOR PARENTS, FOR TEACHERS (Requirement #1) */}
      <section id="benefits" className="py-16 px-4 sm:px-8 max-w-[1280px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary-container">
            Role-Calibrated Experience
          </span>
          <h2 className="font-headline-parent-lg text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Designed for the entire homework support triangle
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Students learn without copying. Parents stay in control without stress. Teachers monitor classroom standards.
          </p>

          {/* Interactive Role Tabs */}
          <div className="inline-flex bg-slate-200/80 p-1 rounded-2xl mt-6 text-xs font-bold shadow-inner">
            <button
              onClick={() => setActiveBenefitTab("students")}
              className={`px-5 py-2.5 rounded-xl transition-all ${
                activeBenefitTab === "students" ? "bg-white text-slate-900 shadow-md font-extrabold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              For Students 🎒
            </button>
            <button
              onClick={() => setActiveBenefitTab("parents")}
              className={`px-5 py-2.5 rounded-xl transition-all ${
                activeBenefitTab === "parents" ? "bg-white text-slate-900 shadow-md font-extrabold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              For Parents 🛡️
            </button>
            <button
              onClick={() => setActiveBenefitTab("teachers")}
              className={`px-5 py-2.5 rounded-xl transition-all ${
                activeBenefitTab === "teachers" ? "bg-white text-slate-900 shadow-md font-extrabold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              For Teachers 👨‍🏫
            </button>
          </div>
        </div>

        {/* Dynamic Benefits Grid based on active tab */}
        {activeBenefitTab === "students" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl mb-4">
                  💡
                </div>
                <h3 className="font-display-hero text-lg font-bold text-slate-900 mb-2">
                  Progressive Hints, Not Giveaways
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Stuck on a tricky problem? Peek at Hint 1 or Hint 2 to get your brain moving without spoiling the satisfaction of solving it yourself.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-amber-700">
                ⭐ Builds real problem-solving grit
              </div>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center text-2xl mb-4">
                  🎨
                </div>
                <h3 className="font-display-hero text-lg font-bold text-slate-900 mb-2">
                  Visual Diagrams & Analogies
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Understand abstract concepts with visual bar models, fraction strips, and organelle city analogies designed for how young minds learn.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-sky-700">
                ⭐ Audio text-to-speech teacher
              </div>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center text-2xl mb-4">
                  🏆
                </div>
                <h3 className="font-display-hero text-lg font-bold text-slate-900 mb-2">
                  Stars, Badges & Mini-Quizzes
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Earn achievement badges like <em>Fraction Explorer</em> and <em>Math Champion</em>, collect stars, and keep your homework streak alive!
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-purple-700">
                ⭐ Gamified learning streak tracker
              </div>
            </div>
          </div>
        )}

        {activeBenefitTab === "parents" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center text-2xl mb-4">
                  🔒
                </div>
                <h3 className="font-display-hero text-lg font-bold text-slate-900 mb-2">
                  Guardian PIN Protection
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The complete worked solution is locked behind your 4-digit PIN. Your child must walk through the teaching steps and mini-quiz before you unlock the final answer.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-indigo-700">
                🛡️ 0% answer copying guarantee
              </div>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl mb-4">
                  📊
                </div>
                <h3 className="font-display-hero text-lg font-bold text-slate-900 mb-2">
                  Plain-English Diagnostics
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  No confusing technical jargon. See exactly what concept was tested, where your child showed strength, and exact at-home practice tips.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-emerald-700">
                🛡️ Screen time & learning goal controls
              </div>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl mb-4">
                  💰
                </div>
                <h3 className="font-display-hero text-lg font-bold text-slate-900 mb-2">
                  Affordable Alternative to Tutoring
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Private tutoring centers charge $60–$100/hour. KidsTech provides 24/7 unlimited multimodal homework guidance for just $8.00/month for one child, and only $12.00/month for two children (50% off additional kids).
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-amber-700">
                🛡️ Saves families over $250 / month
              </div>
            </div>
          </div>
        )}

        {activeBenefitTab === "teachers" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center text-2xl mb-4">
                  📋
                </div>
                <h3 className="font-display-hero text-lg font-bold text-slate-900 mb-2">
                  Review Submitted Homework
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Inspect student-submitted worksheet photos, see AI-generated step-by-step breakdowns, and check student quiz responses in real-time.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-blue-700">
                👨‍🏫 Full visibility into homework struggle areas
              </div>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center text-2xl mb-4">
                  💬
                </div>
                <h3 className="font-display-hero text-lg font-bold text-slate-900 mb-2">
                  Deliver Direct Guidance Notes
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Send personalized encouragement or specific strategy reminders directly to the student's lesson view and parent diagnostic summary.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-purple-700">
                👨‍🏫 Bridges classroom learning to home
              </div>
            </div>

            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center text-2xl mb-4">
                  📈
                </div>
                <h3 className="font-display-hero text-lg font-bold text-slate-900 mb-2">
                  Class Standards & Progress Reports
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Automatically map student assignments to Common Core State Standards (CCSS) and Next Generation Science Standards (NGSS) with one-click exportable reports.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-teal-700">
                👨‍🏫 State-certified teacher portal
              </div>
            </div>
          </div>
        )}
      </section>

      {/* PRICING & FEATURES SECTION (Requirement #1 & Per-Kid Family Pricing) */}
      <section id="pricing" className="py-16 px-4 sm:px-8 bg-white border-y border-slate-200/80">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-container bg-primary-container/10 px-3 py-1 rounded-full">
              Transparent & Affordable Family Pricing
            </span>
            <h2 className="font-headline-parent-lg text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              Per-Child Pricing with 50% Sibling Discount
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Every additional child is only <strong>50% extra</strong>! Never choose which child gets academic guidance.
            </p>
          </div>

          {/* INTERACTIVE FAMILY SIZE / KID SELECTOR CALCULATOR */}
          <div className="max-w-2xl mx-auto mb-12 bg-gradient-to-br from-amber-50/60 via-orange-50/40 to-amber-50/60 p-6 sm:p-7 rounded-3xl border-2 border-amber-200 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Select Family Size
                </span>
                <h3 className="font-headline-parent-lg text-lg font-bold text-slate-900">
                  How many children need homework help?
                </h3>
              </div>

              {/* Stepper Controls */}
              <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-2xl border border-amber-200 shadow-inner">
                <button
                  type="button"
                  onClick={() => setPricingKids(Math.max(1, pricingKids - 1))}
                  disabled={pricingKids <= 1}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-amber-100 disabled:opacity-40 text-slate-800 font-bold flex items-center justify-center transition-all text-base"
                >
                  -
                </button>
                <div className="text-center min-w-[70px]">
                  <span className="font-headline-parent-lg text-xl font-extrabold text-amber-900">
                    {pricingKids} {pricingKids === 1 ? "Kid" : "Kids"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPricingKids(Math.min(6, pricingKids + 1))}
                  disabled={pricingKids >= 6}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-amber-100 disabled:opacity-40 text-slate-800 font-bold flex items-center justify-center transition-all text-base"
                >
                  +
                </button>
              </div>
            </div>

            {/* Quick Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
              {[
                { count: 1, label: "1 Kid", price: "$8.00/mo" },
                { count: 2, label: "2 Kids", price: "$12.00/mo", popular: true },
                { count: 3, label: "3 Kids", price: "$16.00/mo" },
                { count: 4, label: "4 Kids", price: "$20.00/mo" }
              ].map((tier) => (
                <button
                  key={tier.count}
                  type="button"
                  onClick={() => setPricingKids(tier.count)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all relative ${
                    pricingKids === tier.count
                      ? "bg-parent-accent text-white shadow-md transform scale-[1.02]"
                      : "bg-white text-slate-700 hover:bg-amber-100/60 border border-amber-200"
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                      Popular
                    </span>
                  )}
                  <div>{tier.label}</div>
                  <div className={`text-[10px] ${pricingKids === tier.count ? "text-amber-100" : "text-slate-500"}`}>
                    {tier.price}
                  </div>
                </button>
              ))}
            </div>

            {/* Live Pricing Formula Breakdown */}
            <div className="bg-white/90 rounded-2xl p-4 border border-amber-200 text-xs text-slate-700 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-medium text-slate-600">🧒 1st Child Base Plan:</span>
                <span className="font-bold text-slate-900">$8.00 / month</span>
              </div>
              {pricingKids > 1 && (
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-emerald-800">
                  <span className="font-medium">
                    👶 Additional {pricingKids - 1} Child{pricingKids > 2 ? "ren" : ""} (50% Off):
                  </span>
                  <span className="font-bold">
                    +${(pricingKids - 1) * 4}.00 / month (${4.00} ea)
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between pt-1">
                <span className="font-extrabold text-slate-900 text-sm">
                  Total Monthly Family Investment:
                </span>
                <div className="text-right">
                  <span className="font-headline-parent-lg text-lg font-extrabold text-parent-ink">
                    ${8 + (pricingKids - 1) * 4}.00
                  </span>
                  <span className="text-slate-500 text-[11px]"> / month</span>
                  <div className="text-[10px] text-emerald-700 font-bold">
                    (~${((8 + (pricingKids - 1) * 4) / pricingKids).toFixed(2)} / child / mo)
                  </div>
                </div>
              </div>

              {pricingKids > 1 && (
                <div className="mt-2 pt-2 border-t border-amber-100 flex items-center justify-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50/80 py-1.5 rounded-lg">
                  <span>🎉 Sibling Discount saves your family ${(pricingKids - 1) * 4 * 12} per year!</span>
                </div>
              )}
            </div>
          </div>

          {/* DYNAMIC PRICING CARDS */}
          {(() => {
            const annualMonthly = 8 + (pricingKids - 1) * 4;
            const annualTotal = annualMonthly * 12;

            const semMonthly = 10 + (pricingKids - 1) * 5;
            const semTotal = semMonthly * 6;

            const starterMonthly = 12 + (pricingKids - 1) * 6;
            const starterTotal = starterMonthly * 3;

            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
                {/* 3 Months */}
                <div className="bg-slate-50 rounded-3xl p-7 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Flexible Starter</span>
                    <h3 className="font-display-hero text-2xl font-bold text-slate-900 mt-1">3 Months</h3>
                    <div className="mt-4 mb-2">
                      <span className="font-headline-parent-lg text-4xl font-extrabold text-slate-900">
                        ${starterMonthly}.00
                      </span>
                      <span className="text-slate-500 text-sm"> / month</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-6">
                      Billed ${starterTotal}.00 every 3 months for {pricingKids} {pricingKids === 1 ? "child" : "children"}
                    </p>

                    <ul className="space-y-3 text-sm text-slate-600 border-t border-slate-200 pt-6">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span><strong>{pricingKids}</strong> Child Profile{pricingKids > 1 ? "s" : ""} included</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>Unlimited homework uploads</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>Grade 1–12 Socratic AI Teacher</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>Parent PIN Protection Gate</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>Cancel anytime guarantee</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={openSignupModal}
                    className="mt-8 w-full py-3 rounded-xl border-2 border-slate-300 font-bold text-slate-800 hover:bg-slate-100 transition-all text-sm"
                  >
                    Choose 3 Months (${starterMonthly}/mo)
                  </button>
                </div>

                {/* 12 Months (Best Value) */}
                <div className="bg-white rounded-3xl p-7 border-2 border-parent-accent shadow-xl flex flex-col justify-between relative transform md:-translate-y-2">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-parent-accent text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                    Best Value ★ 50% Off Extra Kids
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-parent-accent">Full School Year</span>
                    <h3 className="font-display-hero text-2xl font-bold text-slate-900 mt-1">12 Months Annual</h3>
                    <div className="mt-4 mb-2">
                      <span className="font-headline-parent-lg text-4xl font-extrabold text-parent-ink">
                        ${annualMonthly}.00
                      </span>
                      <span className="text-slate-500 text-sm"> / month</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-6">
                      Billed ${annualTotal}.00 annually for {pricingKids} {pricingKids === 1 ? "child" : "children"}
                    </p>

                    <ul className="space-y-3 text-sm text-slate-700 border-t border-slate-100 pt-6 font-medium">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span><strong>{pricingKids}</strong> Child Profile{pricingKids > 1 ? "s" : ""} included</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>50% sibling discount ($4/mo per extra kid)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Parent PIN Gate & Screen Time Controls</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Full Common Core & NGSS mastery reports</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Printable worksheet generator</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Accommodations (Dyslexia font, Patience mode)</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={openSignupModal}
                    className="mt-8 w-full py-3.5 rounded-xl bg-parent-accent hover:bg-amber-600 text-white font-bold transition-all text-sm shadow-md"
                  >
                    Start Family Plan (${annualMonthly}.00/mo)
                  </button>
                </div>

                {/* 6 Months */}
                <div className="bg-slate-50 rounded-3xl p-7 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Semester Pass</span>
                    <h3 className="font-display-hero text-2xl font-bold text-slate-900 mt-1">6 Months</h3>
                    <div className="mt-4 mb-2">
                      <span className="font-headline-parent-lg text-4xl font-extrabold text-slate-900">
                        ${semMonthly}.00
                      </span>
                      <span className="text-slate-500 text-sm"> / month</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-6">
                      Billed ${semTotal}.00 every 6 months for {pricingKids} {pricingKids === 1 ? "child" : "children"}
                    </p>

                    <ul className="space-y-3 text-sm text-slate-600 border-t border-slate-200 pt-6">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span><strong>{pricingKids}</strong> Child Profile{pricingKids > 1 ? "s" : ""} included</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>Parent PIN Protection Gate</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>Common Core & NGSS progress reports</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>Printable practice worksheets</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={openSignupModal}
                    className="mt-8 w-full py-3 rounded-xl border-2 border-slate-300 font-bold text-slate-800 hover:bg-slate-100 transition-all text-sm"
                  >
                    Choose 6 Months (${semMonthly}/mo)
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* TESTIMONIALS & SUCCESS STORIES (Requirement #1) */}
      <section className="py-16 px-4 sm:px-8 max-w-[1280px] mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary-container">
            Loved by Families & Educators
          </span>
          <h2 className="font-headline-parent-lg text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Real stories from our homework community
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {"★★★★★"}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-4">
                "Before KidsTech, homework time was a battleground. Emma would just ask for the answer. The Parent PIN gate was a game-changer: she actually solves the mini-quizzes and feels so proud when she earns her Math Champion badge!"
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-800">
                SM
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">Sarah Miller</div>
                <div className="text-[11px] text-slate-500">Parent of 3rd & 7th Graders</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {"★★★★★"}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-4">
                "As a 5th grade STEM teacher, I see students use AI as a shortcut to copy answers. KidsTech is different: it acts like a thoughtful educator. When I review their submissions, I can see which hints they needed and send notes directly to parents."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-800">
                RD
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">Mr. Robert Davis</div>
                <div className="text-[11px] text-slate-500">Elementary STEM Lead Teacher</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {"★★★★★"}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-4">
                "I like that the robot doesn't get frustrated when I don't understand fractions right away. The fraction strip diagrams made it make sense, and I have a 4-day streak now!"
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-800">
                🦊
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">Noah (Grade 7)</div>
                <div className="text-[11px] text-slate-500">Student Learner</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION (Requirement #1) */}
      <section id="contact" className="py-16 px-4 sm:px-8 bg-slate-900 text-white">
        <div className="max-w-[1000px] mx-auto flex flex-col lg:flex-row items-start justify-between gap-12">
          <div className="max-w-md">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              Get in Touch
            </span>
            <h2 className="font-headline-parent-lg text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Have questions or want a school pilot?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
              We work closely with parents, homeschool pods, teachers, and school districts. Contact our team and we'll get back to you within 24 hours.
            </p>

            <div className="mt-6 flex flex-col gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400" />
                <span>support@kidstech.demo</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>100% COPPA Safe • Zero Child Data Brokerage</span>
              </div>
            </div>
          </div>

          {/* Working Contact Form */}
          <div className="w-full max-w-md bg-slate-800/90 rounded-3xl p-6 sm:p-7 border border-slate-700 shadow-xl">
            {contactSubmitted ? (
              <div className="py-8 text-center flex flex-col items-center gap-3 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl">
                  ✓
                </div>
                <h4 className="font-bold text-base text-white">Thank you for reaching out!</h4>
                <p className="text-xs text-slate-400">We've received your note and will be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="flex flex-col gap-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Gonzalez"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-700/60 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-700/60 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">I am a...</label>
                  <select
                    value={contactRole}
                    onChange={(e) => setContactRole(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-700/60 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold"
                  >
                    <option value="parent">Parent / Guardian</option>
                    <option value="teacher">Teacher / Educator</option>
                    <option value="admin">School District Administrator</option>
                    <option value="student">Student</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Message</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us about your homework questions or school needs..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-700/60 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 rounded-xl bg-primary-container hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-10 px-4 sm:px-8 border-t border-slate-800">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-white font-display-hero text-lg font-bold">KIDSTECH</span>
            <span>© 2026 KIDSTECH Platform. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setCurrentView("privacy-terms")} className="hover:text-white transition-colors">
              COPPA Privacy Policy
            </button>
            <button onClick={() => setCurrentView("privacy-terms")} className="hover:text-white transition-colors">
              Terms & Conditions
            </button>
            <button onClick={() => setCurrentView("privacy-terms")} className="hover:text-white transition-colors">
              Parent Rights
            </button>
            <button
              onClick={() => loginAsRole("admin")}
              className="text-slate-500 hover:text-amber-400 transition-colors flex items-center gap-1 font-semibold text-[11px] border border-slate-800 px-2.5 py-1 rounded-lg"
              title="Separate Internal Access for Platform Owner"
            >
              <Lock className="w-3 h-3 text-amber-500" />
              <span>Owner / Admin Portal</span>
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;
