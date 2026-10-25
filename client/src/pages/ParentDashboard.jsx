import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Search, Filter, AlertTriangle, CheckCircle2, ChevronRight, ChevronDown, Calendar, BookOpen, Sparkles, Award, UserPlus, FileText, LogOut, Printer, Sliders } from "lucide-react";

export function ParentDashboard() {
  const { sessions, childrenList, setCurrentView, setActiveSession, logout, getChildEmoji } = useApp();

  const [selectedChildFilter, setSelectedChildFilter] = useState("all");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("all");
  const [expandedSessionId, setExpandedSessionId] = useState(sessions[0]?.id || null);

  const subjects = ["All", "Math", "Science", "Reading-Writing", "Social Studies", "Languages"];

  const filteredSessions = sessions.filter((s) => {
    const matchChild = selectedChildFilter === "all" || s.childId === selectedChildFilter;
    const matchSubject = selectedSubjectFilter === "all" || s.subject.toLowerCase() === selectedSubjectFilter.toLowerCase();
    return matchChild && matchSubject;
  });

  const toggleExpand = (id) => {
    setExpandedSessionId(expandedSessionId === id ? null : id);
  };

  return (
    <div className="w-full min-h-screen bg-[#F6F8FB] text-[#1C2B45] py-8 px-4 sm:px-8">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-parent-accent" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Guardian Oversight
              </span>
            </div>
            <h1 className="font-headline-parent-lg text-3xl font-extrabold text-parent-ink">
              Parent Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Plain-English academic summaries, struggle-area diagnosis, and standards alignment.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setCurrentView("worksheet")}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-all border border-amber-200"
              title="Printable Homework Worksheets"
            >
              <Printer className="w-4 h-4 text-amber-600" />
              <span>Worksheets</span>
            </button>
            <button
              onClick={() => setCurrentView("admin-curriculum")}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-bold transition-all border border-indigo-200"
              title="Curriculum Standards Catalog"
            >
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span>Curriculum</span>
            </button>
            <button
              onClick={() => setCurrentView("mastery")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-all border border-teal-200"
            >
              <Award className="w-4 h-4 text-teal-600" />
              <span>Mastery</span>
            </button>
            <button
              onClick={() => setCurrentView("children-profiles")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-sky-800 text-white text-xs font-bold transition-all shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Manage Kids</span>
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-bold transition-all border border-slate-200 hover:border-rose-200"
              title="Log Out and return to Home"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Sliding-Pill Segmented Filter Controls */}
        <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80">
          
          {/* Child Segmented Track */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-wider">
              Child:
            </span>
            <div className="inline-flex bg-slate-100 p-1 rounded-full text-xs font-semibold">
              <button
                onClick={() => setSelectedChildFilter("all")}
                className={`px-4 py-1.5 rounded-full transition-all duration-150 ${
                  selectedChildFilter === "all"
                    ? "bg-parent-accent text-white shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All Children
              </button>
              {childrenList.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChildFilter(child.id)}
                  className={`px-4 py-1.5 rounded-full transition-all duration-150 ${
                    selectedChildFilter === child.id
                      ? "bg-parent-accent text-white shadow-sm font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {child.name} (Grade {child.grade})
                </button>
              ))}
            </div>
          </div>

          {/* Subject Segmented Track */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-wider">
              Subject:
            </span>
            <div className="inline-flex gap-1">
              {subjects.map((subj) => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubjectFilter(subj.toLowerCase())}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedSubjectFilter === subj.toLowerCase()
                      ? "bg-slate-800 text-white font-bold"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Sessions Table with Accordion Expansion */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Recent Homework Sessions ({filteredSessions.length})</span>
            <span>Click row for diagnostic report</span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredSessions.map((s) => {
              const isExpanded = expandedSessionId === s.id;
              const isReview = s.status === "needs_review";

              return (
                <div key={s.id} className="transition-colors hover:bg-slate-50/70">
                  
                  {/* Summary Row */}
                  <div
                    onClick={() => toggleExpand(s.id)}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-xl flex-shrink-0">
                        {getChildEmoji(childrenList.find(c => c.id === s.childId || c.name === s.childName)?.avatar)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-slate-900">{s.childName}</h3>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                            {s.subject}
                          </span>
                          <span className="text-xs text-slate-400">• {s.date}</span>
                        </div>
                        <p className="text-xs font-medium text-slate-700 mt-0.5">
                          {s.topic}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {isReview ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                          <span>Needs Review</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Complete</span>
                        </span>
                      )}

                      <div className="text-slate-400 p-1">
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 bg-slate-50/50 border-t border-slate-100 flex flex-col gap-4">
                      
                      {/* Diagnostic Report Card */}
                      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-parent-teal" />
                            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                              AI Teacher Diagnostic Summary
                            </h4>
                          </div>
                          <span className="text-xs font-mono font-bold bg-teal-50 text-teal-800 px-2.5 py-1 rounded-md border border-teal-200">
                            {s.standard?.code || "CCSS.MATH.3.NBT"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="font-bold text-slate-500 block mb-1">Concept Tested:</span>
                            <p className="text-slate-800 font-medium">{s.parentSummary.conceptTested}</p>

                            <span className="font-bold text-slate-500 block mt-3 mb-1">Observed Strengths:</span>
                            <p className="text-emerald-700 font-medium">{s.parentSummary.childStrengths}</p>
                          </div>

                          <div>
                            <span className="font-bold text-slate-500 block mb-1">Struggle Points / Misconceptions:</span>
                            <p className="text-amber-800 font-medium">{s.parentSummary.strugglePoints}</p>

                            <span className="font-bold text-slate-500 block mt-3 mb-1">How to Help at Home:</span>
                            <p className="text-slate-800 font-medium bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                              💡 {s.parentSummary.atHomeHelpTips}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] text-slate-500">
                            Teacher prompt applied: <em>"{s.teacherInstructionNote}"</em>
                          </span>
                          <button
                            onClick={() => {
                              setActiveSession(s);
                              setCurrentView("explanation");
                            }}
                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                          >
                            <span>Open in Student View</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
