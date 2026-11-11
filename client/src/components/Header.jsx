import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Lock,
  ShieldCheck,
  User,
  Sparkles,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  Home,
  GraduationCap,
  LayoutDashboard,
  Award,
  Users,
  CreditCard,
  Printer,
  ArrowRight,
  ShieldAlert,
  BookOpen
} from "lucide-react";

export function Header() {
  const {
    mode,
    setMode,
    currentView,
    setCurrentView,
    navigateWithPin,
    selectedChild,
    setPinModalOpen,
    logout,
    isLoggedIn,
    currentUser,
    userRole,
    parentProfile,
    openLoginModal,
    openSignupModal
  } = useApp();
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

  const displayName = currentUser?.name || parentProfile?.name || "Guardian";
  const roleName = userRole || (mode === "kid" ? "student" : "parent");

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

          {isLoggedIn && (
            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full font-label-prominent text-xs font-semibold ${
              roleName === "admin" ? "bg-purple-100 text-purple-900" :
              roleName === "teacher" ? "bg-blue-100 text-blue-900" :
              roleName === "student" ? "bg-amber-100 text-amber-900" : "bg-secondary-fixed text-on-secondary-fixed"
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                roleName === "admin" ? "bg-purple-600" :
                roleName === "teacher" ? "bg-blue-600" :
                roleName === "student" ? "bg-amber-500 animate-ping" : "bg-parent-accent"
              }`} />
              <span className="uppercase font-bold text-[10px] tracking-wider">{roleName} PORTAL</span>
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        {currentView === "landing" ? (
          /* Public Website Navigation */
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-slate-600">
            <button
              onClick={() => scrollToSection("benefits")}
              className="hover:text-primary transition-colors cursor-pointer py-1"
            >
              Benefits
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="hover:text-primary transition-colors cursor-pointer py-1"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="hover:text-primary transition-colors cursor-pointer py-1"
            >
              Contact
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
          /* Internal App Navigation */
          <nav className="hidden lg:flex items-center gap-1 bg-surface-container-low p-1.5 rounded-full text-sm font-medium">
            <button
              onClick={() => setCurrentView("landing")}
              className="px-3 py-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-white transition-all text-xs font-bold"
            >
              Home
            </button>

            {roleName === "admin" && (
              <>
                <button
                  onClick={() => setCurrentView("admin-dashboard")}
                  className={`px-3.5 py-1.5 rounded-full transition-all text-xs font-bold ${
                    currentView === "admin-dashboard" ? "bg-purple-700 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Admin Portal
                </button>
                <button
                  onClick={() => setCurrentView("admin-curriculum")}
                  className={`px-3.5 py-1.5 rounded-full transition-all text-xs font-bold ${
                    currentView === "admin-curriculum" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Curriculum
                </button>
              </>
            )}

            {roleName === "teacher" && (
              <>
                <button
                  onClick={() => setCurrentView("teacher-dashboard")}
                  className={`px-3.5 py-1.5 rounded-full transition-all text-xs font-bold ${
                    currentView === "teacher-dashboard" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Teacher Portal
                </button>
                <button
                  onClick={() => setCurrentView("worksheet")}
                  className={`px-3.5 py-1.5 rounded-full transition-all text-xs font-bold ${
                    currentView === "worksheet" ? "bg-amber-500 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Worksheets
                </button>
              </>
            )}

            {roleName === "student" && (
              <>
                <button
                  onClick={() => {
                    setMode("kid");
                    setCurrentView("kids-switcher");
                  }}
                  className={`px-3.5 py-1.5 rounded-full transition-all text-xs font-bold ${
                    currentView === "kids-switcher" ? "bg-primary-container text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Kids Hub
                </button>
                <button
                  onClick={() => setCurrentView("upload")}
                  className={`px-3.5 py-1.5 rounded-full transition-all text-xs font-bold ${
                    currentView === "upload" ? "bg-sky-500 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Upload Homework
                </button>
                <button
                  onClick={() => setCurrentView("worksheet")}
                  className={`px-3.5 py-1.5 rounded-full transition-all text-xs font-bold ${
                    currentView === "worksheet" ? "bg-amber-500 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Worksheets
                </button>
              </>
            )}

            {roleName === "parent" && (
              <>
                <button
                  onClick={() => setCurrentView("parent-dashboard")}
                  className={`px-3.5 py-1.5 rounded-full transition-all text-xs font-bold ${
                    currentView === "parent-dashboard" ? "bg-parent-accent text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Parent Dashboard
                </button>
                <button
                  onClick={() => setCurrentView("mastery")}
                  className={`px-3.5 py-1.5 rounded-full transition-all text-xs font-bold ${
                    currentView === "mastery" ? "bg-teal-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Mastery
                </button>
                <button
                  onClick={() => setCurrentView("children-profiles")}
                  className={`px-3.5 py-1.5 rounded-full transition-all text-xs font-bold ${
                    currentView === "children-profiles" ? "bg-primary text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Children
                </button>
                <button
                  onClick={() => setCurrentView("subscription")}
                  className={`px-3.5 py-1.5 rounded-full transition-all text-xs font-bold ${
                    currentView === "subscription" ? "bg-primary text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Subscription
                </button>
              </>
            )}
          </nav>
        )}

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isLoggedIn ? (
            <>
              {/* User Profile Badge */}
              <div
                onClick={() => {
                  if (roleName === "admin") setCurrentView("admin-dashboard");
                  else if (roleName === "teacher") setCurrentView("teacher-dashboard");
                  else if (roleName === "student") setCurrentView("kids-switcher");
                  else setCurrentView("parent-dashboard");
                }}
                className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity pl-1"
                title="Open user portal"
              >
                <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-primary/20">
                  {displayName.charAt(0)}
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    {displayName}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize font-medium">
                    {roleName}
                  </span>
                </div>
              </div>

              {/* Log Out */}
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
            /* Logged Out Visitor State: Public Home Page Actions */
            <div className="flex items-center gap-2">
              <button
                id="header-login-btn"
                onClick={openLoginModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 transition-all active:scale-95"
                title="Sign in with Email or Demo Role"
              >
                <LogIn className="w-3.5 h-3.5 text-primary" />
                <span>Sign In</span>
              </button>

              <button
                id="header-signup-btn"
                onClick={openSignupModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold bg-primary hover:bg-sky-800 text-white shadow-sm transition-all active:scale-95"
                title="Create a new account"
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
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 flex flex-col gap-3 text-xs font-bold text-slate-700 animate-slideDown">
          <button onClick={() => handleMobileNav(() => setCurrentView("landing"))} className="py-2 text-left">
            Home
          </button>
          <button onClick={() => handleMobileNav(() => setCurrentView("kids-switcher"))} className="py-2 text-left">
            Student Hub
          </button>
          <button onClick={() => handleMobileNav(() => setCurrentView("parent-dashboard"))} className="py-2 text-left">
            Parent Dashboard
          </button>
          <button onClick={() => handleMobileNav(() => setCurrentView("teacher-dashboard"))} className="py-2 text-left">
            Teacher Dashboard
          </button>
          {roleName === "admin" && (
            <button onClick={() => handleMobileNav(() => setCurrentView("admin-dashboard"))} className="py-2 text-left text-purple-700">
              Admin Portal
            </button>
          )}
          {isLoggedIn ? (
            <button onClick={() => handleMobileNav(logout)} className="py-2 text-left text-rose-600">
              Log Out
            </button>
          ) : (
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => handleMobileNav(openLoginModal)} className="flex-1 py-2 bg-slate-100 rounded-xl text-center">
                Log In
              </button>
              <button onClick={() => handleMobileNav(openSignupModal)} className="flex-1 py-2 bg-primary text-white rounded-xl text-center">
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
