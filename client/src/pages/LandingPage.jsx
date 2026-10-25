import React from "react";
import { useApp } from "../context/AppContext";
import { Sparkles, Shield, ArrowRight, CheckCircle2, Star, BookOpen, Brain, Users, Award, FileText, Check } from "lucide-react";

export function LandingPage() {
  const { setCurrentView, setMode, launchKidSession, childrenList, setSelectedChild, setActiveSession, sessions, isLoggedIn, parentProfile, openLoginModal, openSignupModal } = useApp();

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-800">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-8 max-w-[1280px] mx-auto">
        {/* Subtle decorative blurred blobs */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-sky-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-24 right-1/4 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 pt-6">
          <div className="flex flex-col gap-6 max-w-xl text-left">
            <div className="inline-flex items-center gap-2 bg-sky-100 border border-sky-200 text-sky-900 px-3.5 py-1.5 rounded-full text-xs font-bold w-fit shadow-sm">
              <Sparkles className="w-4 h-4 text-primary-container" />
              <span>AI-Powered K–12 Study Assistant</span>
            </div>

            <h1 className="font-headline-parent-lg text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-parent-ink tracking-tight leading-[1.12]">
              Homework help that talks to your kid <span className="text-primary-container underline decoration-amber-400 decoration-4 underline-offset-8">like a real teacher.</span>
            </h1>

            <p className="font-body-parent-md text-base sm:text-lg text-slate-600 leading-relaxed">
              Upload any homework page or worksheet. Our AI teacher breaks it down step-by-step in an age-appropriate, encouraging tone — while parents get a plain-English diagnostic report on what they mastered and where to help.
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
                    setMode("parent");
                    setCurrentView("parent-dashboard");
                  }}
                  className="px-7 py-4 rounded-2xl bg-white hover:bg-slate-100 text-parent-ink border-2 border-slate-200 font-headline-parent-md text-base font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  <span>Open Parent Dashboard ({parentProfile?.name?.split(" ")[0] || "Parent"})</span>
                </button>
              ) : (
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={openSignupModal}
                    className="px-7 py-4 rounded-2xl bg-primary hover:bg-sky-800 text-white font-headline-parent-md text-base font-bold transition-all shadow-md active:scale-95 flex items-center gap-2"
                  >
                    <span>Create Free Account</span>
                  </button>

                  <button
                    onClick={openLoginModal}
                    className="px-6 py-4 rounded-2xl bg-white hover:bg-slate-100 text-parent-ink border-2 border-slate-200 font-headline-parent-md text-sm font-bold transition-all shadow-sm"
                  >
                    <span>Sign In</span>
                  </button>
                </div>
              )}
            </div>

            {/* Social quick sign-in trust strip */}
            {!isLoggedIn && (
              <div className="flex items-center gap-2 text-xs text-slate-500 pt-1 font-medium">
                <span>Sign up in 30 seconds with</span>
                <button onClick={() => openLoginModal()} className="font-bold text-slate-700 hover:text-primary underline">
                  Google
                </button>
                <span>•</span>
                <button onClick={() => openLoginModal()} className="font-bold text-slate-700 hover:text-primary underline">
                  Apple ID
                </button>
                <span>•</span>
                <button onClick={() => openSignupModal()} className="font-bold text-slate-700 hover:text-primary underline">
                  Email & PIN
                </button>
              </div>
            )}

            {/* Micro Trust Indicators */}
            <div className="flex items-center gap-6 pt-2 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>COPPA Safe & Compliant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Common Core & NGSS Aligned</span>
              </div>
            </div>
          </div>

          {/* Interactive Live Sample Card */}
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200/80 relative">
            <div className="absolute -top-3.5 -right-3.5 bg-parent-accent text-white px-3.5 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Live Sample Session</span>
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

            {/* AI Teacher Card Quote */}
            <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100 mb-4">
              <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block mb-1">
                AI Teacher Explanation
              </span>
              <p className="text-sm font-medium text-slate-700 leading-snug">
                "When you add 8 + 9 in the ones column, you get 17! That's 1 ten and 7 ones. Keep the 7, and carry the 1 ten up to the tens place roof!"
              </p>
            </div>

            {/* Answers & Tip */}
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Final Answers Self-Check: 47, 82, 61</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded-md shadow-2xs">
                Verified
              </span>
            </div>

            {/* Parent Insight Drawer Preview */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="font-bold text-parent-ink">Parent Summary Preview:</span>
                <span className="text-amber-600 font-semibold">Standard: CCSS 3.NBT.A.2</span>
              </div>
              <p className="text-slate-600 line-clamp-2">
                "Emma lined up place values flawlessly. Home tip: Try Make-Ten card games to build speed when carrying tens."
              </p>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setMode("kid");
                  const emmaChild = childrenList.find((c) => c.name === "Emma") || childrenList[0];
                  if (emmaChild) setSelectedChild(emmaChild);
                  const emmaSession = sessions.find((s) => s.childName === "Emma") || sessions[0];
                  if (emmaSession) setActiveSession(emmaSession);
                  setCurrentView("explanation");
                }}
                className="text-xs font-bold text-primary hover:underline"
              >
                Launch this sample in interactive player →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process Row */}
      <section id="how-it-works" className="bg-white py-16 px-4 sm:px-8 border-y border-slate-200">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Simple 3-Step Flow</span>
            <h2 className="font-display-hero text-3xl font-bold text-parent-ink mt-2">
              How KIDSTECH Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-2xl p-7 border border-slate-100 relative">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-primary font-display-hero text-xl font-bold flex items-center justify-center mb-4">
                01
              </div>
              <h3 className="font-display-hero text-xl font-bold text-slate-900 mb-2">Upload Homework</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Take a quick photo or drop JPG, PNG, or PDF worksheets. Pick the subject with big, kid-friendly buttons.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-7 border border-slate-100 relative">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 font-display-hero text-xl font-bold flex items-center justify-center mb-4">
                02
              </div>
              <h3 className="font-display-hero text-xl font-bold text-slate-900 mb-2">AI Teacher Explains</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Step-by-step walkthrough calibrated to the child's exact grade band, complete with voice read-aloud and encouraging tips.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-7 border border-slate-100 relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 font-display-hero text-xl font-bold flex items-center justify-center mb-4">
                03
              </div>
              <h3 className="font-display-hero text-xl font-bold text-slate-900 mb-2">Parent Reviews</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Parents see standards alignment (Common Core & NGSS), mastery velocity, struggle flags, and actionable tips for helping at home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Pricing Selector */}
      <section id="pricing" className="py-20 px-4 sm:px-8 max-w-[1280px] mx-auto">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-parent-accent">Flexible Subscriptions</span>
          <h2 className="font-display-hero text-3xl sm:text-4xl font-bold text-parent-ink mt-2">
            Choose Your Learning Plan
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            All plans include full access to the AI Teacher, unlimited homework uploads, and verified parental controls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* 3 Months */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-md flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Starter</span>
              <h3 className="font-display-hero text-2xl font-bold text-slate-900 mt-1">3 Months</h3>
              <div className="mt-4 mb-2">
                <span className="font-headline-parent-lg text-4xl font-extrabold text-parent-ink">$14.99</span>
                <span className="text-slate-500 text-sm"> / month</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">Billed $44.97 every 3 months</p>

              <ul className="space-y-3 text-sm text-slate-600 border-t border-slate-100 pt-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Unlimited homework uploads</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Grades 1–12 AI Teacher Agent</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Audio read-aloud TTS</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Cancel anytime</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setCurrentView("subscription")}
              className="mt-8 w-full py-3 rounded-xl border-2 border-slate-300 font-bold text-slate-800 hover:bg-slate-50 transition-all text-sm"
            >
              Select 3 Months
            </button>
          </div>

          {/* 12 Months (Best Value - Center Raised) */}
          <div className="bg-white rounded-3xl p-8 border-2 border-parent-accent shadow-2xl flex flex-col justify-between relative transform md:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-parent-accent text-white px-4 py-1 rounded-full text-xs font-bold shadow-md uppercase tracking-wider">
              ★ Best Value • Save 40%
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Full School Year</span>
              <h3 className="font-display-hero text-2xl font-bold text-slate-900 mt-1">12 Months</h3>
              <div className="mt-4 mb-2">
                <span className="font-headline-parent-lg text-4xl font-extrabold text-parent-ink">$8.99</span>
                <span className="text-slate-500 text-sm"> / month</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">Billed $107.88 annually</p>

              <ul className="space-y-3 text-sm text-slate-700 border-t border-slate-100 pt-6 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Unlimited children & sibling profiles</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Full Common Core & NGSS mastery tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Printable practice worksheet generator</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Accommodations (Dyslexia font, Patience mode)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Priority guardian customer support</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setCurrentView("subscription")}
              className="mt-8 w-full py-3.5 rounded-xl bg-parent-accent hover:bg-amber-600 text-white font-bold transition-all text-sm shadow-md"
            >
              Get Best Value Plan
            </button>
          </div>

          {/* 6 Months */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-md flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Semester Pass</span>
              <h3 className="font-display-hero text-2xl font-bold text-slate-900 mt-1">6 Months</h3>
              <div className="mt-4 mb-2">
                <span className="font-headline-parent-lg text-4xl font-extrabold text-parent-ink">$11.99</span>
                <span className="text-slate-500 text-sm"> / month</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">Billed $71.94 every 6 months</p>

              <ul className="space-y-3 text-sm text-slate-600 border-t border-slate-100 pt-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Up to 3 child profiles</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Common Core & NGSS progress reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Printable worksheet generator</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Cancel anytime</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setCurrentView("subscription")}
              className="mt-8 w-full py-3 rounded-xl border-2 border-slate-300 font-bold text-slate-800 hover:bg-slate-50 transition-all text-sm"
            >
              Select 6 Months
            </button>
          </div>

        </div>

        <p className="text-center text-xs text-slate-500 mt-8">
          Cancel anytime with 1-click self-serve cancellation. No cancellation fees, no hidden charges.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-8 border-t border-slate-800">
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
              Guardian Data Rights
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
