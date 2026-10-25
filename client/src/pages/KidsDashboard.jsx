import React from "react";
import { useApp } from "../context/AppContext";
import { Sparkles, UserPlus, SlidersHorizontal, Lock, CheckCircle2, AlertTriangle, ArrowRight, BookOpen, Flame, Star, Rocket } from "lucide-react";

export function KidsDashboard() {
  const { childrenList, launchKidSession, navigateWithPin, setCurrentView, getChildEmoji } = useApp();

  return (
    <div className="w-full min-h-screen bg-slate-50 py-10 px-4 sm:px-8">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-8">
        
        {/* Orientation Card */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/80">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full w-fit">
              <span className="w-2.5 h-2.5 rounded-full bg-parent-accent animate-pulse" />
              <span className="font-label-prominent text-xs font-bold text-amber-800">
                Profile Switcher • Bridge Canvas
              </span>
            </div>

            <h1 className="font-display-hero text-3xl sm:text-4xl lg:text-5xl font-extrabold text-parent-ink tracking-tight">
              Who's doing homework today? <span className="inline-block transform hover:rotate-12 transition-transform cursor-pointer">🎒</span>
            </h1>

            <p className="font-body-kid-md text-base sm:text-lg text-slate-600">
              Tap your profile card to start your personalized AI tutoring session, or unlock with Parent PIN to change settings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                navigateWithPin("children-profiles");
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4 text-primary" />
              <span>+ Add Another Child</span>
            </button>

            <button
              onClick={() => {
                navigateWithPin("parent-dashboard");
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-primary hover:bg-sky-800 text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Guardian Controls</span>
            </button>
          </div>
        </div>

        {/* Profile Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {childrenList.map((child) => {
            const isEmma = child.name === "Emma";
            const isNoah = child.name === "Noah";

            return (
              <div
                key={child.id}
                className="bg-white rounded-3xl p-6 sm:p-7 shadow-md hover:shadow-xl transition-all duration-200 border border-slate-200 flex flex-col justify-between relative group"
              >
                {/* Top Badge */}
                <div className="absolute top-5 right-5">
                  {isNoah ? (
                    <span className="bg-red-50 text-red-700 text-xs font-bold px-3 py-1 rounded-full border border-red-200 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                      <span>1 Needs Review</span>
                    </span>
                  ) : (
                    <span className="bg-sky-50 text-sky-800 text-xs font-bold px-3 py-1 rounded-full border border-sky-200 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-sky-600" />
                      <span>PIN Protected</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  {/* Mascot Badge */}
                  <div className="flex items-center gap-4 pt-1">
                    <div className="relative w-20 h-20 rounded-2xl bg-amber-100 border-2 border-amber-200 flex items-center justify-center text-4xl shadow-md group-hover:scale-105 transition-transform">
                      {getChildEmoji(child.avatar)}
                      
                      <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary-container text-white flex items-center justify-center text-xs shadow-sm font-bold">
                        ✓
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-display-hero text-2xl font-bold text-slate-900">{child.name}</h2>
                        <span className="w-2.5 h-2.5 rounded-full bg-parent-accent" />
                      </div>
                      <p className="text-xs font-semibold text-slate-500">Grade {child.grade} • {child.track || 'Academic Track'}</p>
                    </div>
                  </div>

                  {/* Momentum Pill */}
                  <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl text-xs text-slate-700 font-semibold border border-slate-100">
                    <Flame className="w-4 h-4 text-amber-500 fill-current" />
                    <span className="text-amber-700 font-bold">{child.weeklySessions} Sessions this week</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">{child.autonomyScore}% Autonomy</span>
                  </div>

                  {/* Academic Focus */}
                  <div className="bg-sky-50/60 rounded-xl p-3 border border-sky-100/80">
                    <span className="text-[10px] uppercase font-bold text-sky-800 tracking-wider flex items-center gap-1 mb-1">
                      <BookOpen className="w-3 h-3" /> Active Focus
                    </span>
                    <p className="text-xs font-semibold text-slate-800 leading-snug">
                      {child.activeFocus}
                    </p>
                  </div>

                  {/* Accommodations pill */}
                  {child.accommodations && (
                    <div className="flex items-center gap-1.5 text-slate-600 text-[11px] font-medium bg-slate-100 px-3 py-1 rounded-full w-fit">
                      <Sparkles className="w-3 h-3 text-parent-accent" />
                      <span>
                        {child.accommodations.dyslexiaFont ? "Dyslexia Spacing • " : ""}
                        {child.accommodations.patienceMode ? "Patience Mode • " : ""}
                        {child.accommodations.socraticHintsOnly ? "Socratic Hints Only" : "Warm Tone"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tactile Button to Launch Homework */}
                <div className="pt-6">
                  <button
                    onClick={() => launchKidSession(child)}
                    className="w-full py-4 px-4 bg-primary-container hover:bg-sky-500 text-white font-display-hero text-base font-bold rounded-2xl shadow-[0_6px_0_0_#004c69] active:shadow-[0_1px_0_0_#004c69] active:translate-y-[5px] transition-all flex items-center justify-center gap-2"
                  >
                    <span>Start {child.name}'s Homework</span>
                    <Rocket className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
