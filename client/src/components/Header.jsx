import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Lock, ShieldCheck, User, Sparkles, LogOut, LogIn, UserPlus, Menu, X, Home, GraduationCap, LayoutDashboard, Award, Users, CreditCard, Printer, ArrowRight } from "lucide-react";

export function Header() {
  const { mode, setMode, currentView, setCurrentView, navigateWithPin, selectedChild, setPinModalOpen, logout, isLoggedIn, parentProfile, openLoginModal, openSignupModal } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileNav = (action) => {
    setMobileMenuOpen(false);
    action();
  };

  const scrollToSection = (id) => {
    if (currentView !== "landing") {
      setCurrentView("landing");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 max-w-[1280px] mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Mode Badge */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView("landing")}>
          <div className="relative w-11 h-11 rounded-2xl bg-primary-container flex items-center justify-center shadow-md">
            <span className="text-2xl" role="img" aria-label="KIDSTECH">🎒</span>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-parent-accent ring-2 ring-white animate-pulse" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display-hero text-2xl font-bold text-parent-ink tracking-tight">
                KIDS<span className="text-primary-container">TECH</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-parent-accent inline-block" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Study Assistant
            </span>
          </div>

          {isLoggedIn && currentView !== "landing" && (
            <div className="hidden sm:flex items-center gap-1.5 bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full font-label-prominent text-xs font-semibold">
              <span className={`w-2 h-2 rounded-full ${mode === "kid" ? "bg-kid-accent animate-ping" : "bg-parent-accent"}`} />
              <span>{mode === "kid" ? `KID MODE (${selectedChild?.name || 'Student'})` : "BRIDGE MODE"}</span>
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        {currentView === "landing" ? (
          /* Clean Landing Website Navigation (NO internal app tabs) */
          <nav className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-600">
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="hover:text-primary transition-colors cursor-pointer py-1"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="hover:text-primary transition-colors cursor-pointer py-1"
            >
              Pricing
            </button>
            <button
              onClick={() => {
                setMode("kid");
                setCurrentView("kids-switcher");
              }}
              className="text-slate-600 hover:text-primary transition-colors cursor-pointer flex items-center gap-1.5 py-1"
            >
              <span>Student Hub</span>
              <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-bold">Demo</span>
            </button>
          </nav>
        ) : (
          /* Internal App Navigation (Shown only when inside dashboard/hub views) */
          <nav className="hidden lg:flex items-center gap-1 bg-surface-container-low p-1.5 rounded-full text-sm font-medium">
            <button
              onClick={() => setCurrentView("landing")}
              className="px-3.5 py-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-white transition-all text-xs font-bold"
            >
              Home
            </button>
            <button
              onClick={() => {
                setMode("kid");
                setCurrentView("kids-switcher");
              }}
              className={`px-3.5 py-1.5 rounded-full transition-all text-xs font-bold ${
                currentView === "kids-switcher"
                  ? "bg-primary-container text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white"
              }`}
            >
              Kids Hub
            </button>
            <button
              onClick={() => navigateWithPin("parent-dashboard")}
              className={`px-3.5 py-1.5 rounded-full transition-all text-xs font-bold ${
                currentView === "parent-dashboard"
                  ? "bg-parent-accent text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigateWithPin("mastery")}
              className={`px-3.5 py-1.5 rounded-full transition-all text-xs font-bold ${
                currentView === "mastery"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white"
              }`}
            >
              Mastery
            </button>
            <button
              onClick={() => setCurrentView("worksheet")}
              className={`px-3.5 py-1.5 rounded-full transition-all text-xs font-bold ${
                currentView === "worksheet"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white"
              }`}
            >
              Worksheets
            </button>
            <button
              onClick={() => navigateWithPin("children-profiles")}
              className={`px-3.5 py-1.5 rounded-full transition-all text-xs font-bold ${
                currentView === "children-profiles"
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white"
              }`}
            >
              Children
            </button>
            <button
              onClick={() => setCurrentView("subscription")}
              className={`px-3.5 py-1.5 rounded-full transition-all text-xs font-bold ${
                currentView === "subscription"
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white"
              }`}
            >
              Plans
            </button>
          </nav>
        )}

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {mode === "kid" && isLoggedIn ? (
            <button
              onClick={() => {
                setPinModalOpen(true);
              }}
              className="flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3.5 py-1.5 rounded-full text-xs font-bold hover:bg-amber-200 transition-colors shadow-sm"
              title="Parent PIN required to exit Kid Mode"
            >
              <Lock className="w-3.5 h-3.5 text-parent-accent" />
              <span>Exit Kid Mode</span>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-slate-700 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">COPPA Verified</span>
            </div>
          )}

          {isLoggedIn ? (
            <>
              {currentView === "landing" && (
                <button
                  onClick={() => {
                    setMode("parent");
                    setCurrentView("parent-dashboard");
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary hover:bg-sky-800 text-white shadow-xs transition-all active:scale-95"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {/* User Profile Pill */}
              <div
                onClick={() => navigateWithPin("parent-dashboard")}
                className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity pl-1"
                title="Open Parent Dashboard"
              >
                <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-primary/20">
                  {parentProfile?.name ? parentProfile.name.charAt(0) : "S"}
                </div>
                <span className="hidden xl:inline text-xs font-bold text-slate-800">
                  {parentProfile?.name || "Sarah M."}
                </span>
              </div>

              {/* Explicit Log Out Button */}
              <button
                id="header-logout-btn"
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all shadow-xs active:scale-95"
                title="Log Out and return to Home"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </>
          ) : (
            /* Logged Out State: Clean Sign In & Get Started buttons */
            <div className="flex items-center gap-2">
              <button
                id="header-login-btn"
                onClick={openLoginModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 transition-all active:scale-95"
                title="Sign in with Google, Apple ID, or Email"
              >
                <LogIn className="w-3.5 h-3.5 text-primary" />
                <span>Sign In</span>
              </button>

              <button
                id="header-signup-btn"
                onClick={openSignupModal}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-primary hover:bg-sky-800 text-white shadow-sm transition-all active:scale-95"
                title="Create a new Guardian Account"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Get Started</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 flex flex-col gap-2 shadow-lg animate-fadeIn">
          {currentView === "landing" ? (
            /* Clean Landing Website Mobile Links */
            <>
              <button
                onClick={() => handleMobileNav(() => scrollToSection("how-it-works"))}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-left text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <span>How It Works</span>
              </button>
              <button
                onClick={() => handleMobileNav(() => scrollToSection("pricing"))}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-left text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <span>Pricing Plans</span>
              </button>
              <button
                onClick={() =>
                  handleMobileNav(() => {
                    setMode("kid");
                    setCurrentView("kids-switcher");
                  })
                }
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-left text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <GraduationCap className="w-4 h-4 text-sky-500" />
                <span>Try Student Demo</span>
              </button>
            </>
          ) : (
            /* Internal App Mobile Links */
            <>
              <button
                onClick={() => handleMobileNav(() => setCurrentView("landing"))}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-left text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Home className="w-4 h-4 text-slate-500" />
                <span>Home</span>
              </button>
              <button
                onClick={() =>
                  handleMobileNav(() => {
                    setMode("kid");
                    setCurrentView("kids-switcher");
                  })
                }
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-left text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <GraduationCap className="w-4 h-4 text-sky-500" />
                <span>Kids Hub</span>
              </button>
              <button
                onClick={() => handleMobileNav(() => navigateWithPin("parent-dashboard"))}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-left text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-500" />
                <span>Parent Dashboard</span>
              </button>
              <button
                onClick={() => handleMobileNav(() => navigateWithPin("mastery"))}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-left text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Award className="w-4 h-4 text-teal-500" />
                <span>Mastery & Standards</span>
              </button>
              <button
                onClick={() => handleMobileNav(() => setCurrentView("worksheet"))}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-left text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Printer className="w-4 h-4 text-amber-500" />
                <span>Print Worksheets</span>
              </button>
              <button
                onClick={() => handleMobileNav(() => navigateWithPin("children-profiles"))}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-left text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Users className="w-4 h-4 text-primary" />
                <span>Children Profiles</span>
              </button>
              <button
                onClick={() => handleMobileNav(() => setCurrentView("subscription"))}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-left text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <CreditCard className="w-4 h-4 text-slate-500" />
                <span>Plans & Billing</span>
              </button>
            </>
          )}

          <div className="pt-2 border-t border-slate-100 mt-1">
            {isLoggedIn ? (
              <button
                onClick={() => handleMobileNav(logout)}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-left text-sm font-bold text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Log Out & Go Home</span>
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleMobileNav(openLoginModal)}
                  className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-left text-sm font-bold text-slate-700 hover:bg-slate-100"
                >
                  <LogIn className="w-4 h-4 text-primary" />
                  <span>Parent Sign In</span>
                </button>
                <button
                  onClick={() => handleMobileNav(openSignupModal)}
                  className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-left text-sm font-bold bg-primary text-white hover:bg-sky-800"
                >
                  <UserPlus className="w-4 h-4 text-white" />
                  <span>Create Account</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
