import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Calendar,
  BookOpen,
  Sparkles,
  Award,
  UserPlus,
  FileText,
  LogOut,
  Printer,
  Sliders,
  Lock,
  Unlock,
  Clock,
  Target,
  KeyRound,
  ShieldCheck,
  CreditCard,
  Check,
  Eye
} from "lucide-react";

export function ParentDashboard() {
  const {
    sessions,
    setSessions,
    childrenList,
    setCurrentView,
    setActiveSession,
    logout,
    getChildEmoji,
    parentProfile,
    setParentProfile,
    parentControls,
    setParentControls,
    approvedAnswers,
    showToast,
    API_BASE
  } = useApp();

  const [selectedChildFilter, setSelectedChildFilter] = useState("all");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("all");
  const [expandedSessionId, setExpandedSessionId] = useState(sessions[0]?.id || null);

  // Parent Controls Modal / Tab state
  const [showControlsModal, setShowControlsModal] = useState(false);
  const [requirePinToggle, setRequirePinToggle] = useState(parentControls?.requirePin ?? true);
  const [screenTimeInput, setScreenTimeInput] = useState(parentControls?.screenTimeMinutes || 45);
  const [weeklyGoalInput, setWeeklyGoalInput] = useState(parentControls?.weeklyGoalSessions || 4);
  const [newPinInput, setNewPinInput] = useState(parentProfile?.pin || "1234");
  const [isSavingControls, setIsSavingControls] = useState(false);

  const subjects = ["All", "Math", "Science", "Reading-Writing", "Social Studies", "Languages"];

  const filteredSessions = sessions.filter((s) => {
    const matchChild = selectedChildFilter === "all" || s.childId === selectedChildFilter;
    const matchSubject = selectedSubjectFilter === "all" || s.subject.toLowerCase() === selectedSubjectFilter.toLowerCase();
    return matchChild && matchSubject;
  });

  const toggleExpand = (id) => {
    setExpandedSessionId(expandedSessionId === id ? null : id);
  };

  // Remote approve student answer
  const handleRemoteApprove = async (session) => {
    try {
      await fetch(`${API_BASE}/parent/approve-answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id })
      });
      setSessions(prev => prev.map(s => s.id === session.id ? { ...s, parentApproved: true } : s));
      showToast(`Final answer approved for ${session.childName}'s ${session.subject} homework!`);
    } catch (err) {
      setSessions(prev => prev.map(s => s.id === session.id ? { ...s, parentApproved: true } : s));
      showToast(`Final answer approved for ${session.childName}'s ${session.subject} homework!`);
    }
  };

  // Save parent controls settings
  const handleSaveControls = async (e) => {
    e.preventDefault();
    setIsSavingControls(true);
    try {
      const updated = {
        requirePin: requirePinToggle,
        screenTimeMinutes: Number(screenTimeInput),
        weeklyGoalSessions: Number(weeklyGoalInput),
        pin: newPinInput
      };
      setParentControls(prev => ({ ...prev, ...updated }));
      setParentProfile(prev => ({ ...prev, pin: newPinInput }));

      await fetch(`${API_BASE}/parent/controls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      showToast("Parent controls & PIN preferences updated!");
      setShowControlsModal(false);
    } catch (err) {
      showToast("Parent controls updated locally!");
      setShowControlsModal(false);
    } finally {
      setIsSavingControls(false);
    }
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
                Guardian Oversight • {parentProfile?.name || "Parent"}
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
              onClick={() => setShowControlsModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-bold transition-all border border-indigo-200 shadow-xs"
              title="Parent PIN, Screen Time & Answer Approvals"
            >
              <Lock className="w-4 h-4 text-indigo-600" />
              <span>Parent Controls</span>
            </button>

            <button
              onClick={() => setCurrentView("worksheet")}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-all border border-amber-200"
              title="Printable Homework Worksheets"
            >
              <Printer className="w-4 h-4 text-amber-600" />
              <span>Worksheets</span>
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

        {/* Parent Controls Highlights Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                {requirePinToggle ? "PIN Protection ON" : "PIN Protection OFF"}
              </div>
              <div className="text-[11px] text-slate-500">
                PIN: <strong className="font-mono text-slate-700">{parentProfile?.pin || "1234"}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Screen Time Limit</div>
              <div className="text-[11px] text-slate-500">{screenTimeInput} Mins / Day</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Weekly Goal</div>
              <div className="text-[11px] text-slate-500">{weeklyGoalInput} Sessions / Week</div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end">
            <button
              onClick={() => setShowControlsModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
            >
              Edit Controls ⚙️
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

        {/* Sessions Table with Accordion Expansion & Remote Approval */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Recent Homework Sessions ({filteredSessions.length})</span>
            <span>Click row for diagnostic report & approvals</span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredSessions.map((s) => {
              const isExpanded = expandedSessionId === s.id;
              const isReview = s.status === "needs_review";
              const isApproved = s.parentApproved || approvedAnswers.has(s.id);

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

                    <div className="flex items-center gap-3">
                      {isApproved ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                          <span>Answer Approved</span>
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoteApprove(s);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-all"
                          title="Grant PIN unlock authorization for child"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Approve Answer</span>
                        </button>
                      )}

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
                            <p className="text-slate-800 font-medium">{s.parentSummary?.conceptTested || "Core standards competency"}</p>

                            <span className="font-bold text-slate-500 block mt-3 mb-1">Observed Strengths:</span>
                            <p className="text-emerald-700 font-medium">{s.parentSummary?.childStrengths || "Great column alignment and accuracy."}</p>
                          </div>

                          <div>
                            <span className="font-bold text-slate-500 block mb-1">Struggle Points / Misconceptions:</span>
                            <p className="text-amber-800 font-medium">{s.parentSummary?.strugglePoints || "Double-checking carried digits."}</p>

                            <span className="font-bold text-slate-500 block mt-3 mb-1">How to Help at Home:</span>
                            <p className="text-slate-800 font-medium bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                              💡 {s.parentSummary?.atHomeHelpTips || "Practice real-world examples together!"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] text-slate-500">
                            Teacher prompt applied: <em>"{s.teacherInstructionNote || 'Encouraging guidance'}"</em>
                          </span>
                          <button
                            onClick={() => {
                              setActiveSession(s);
                              setCurrentView("explanation");
                            }}
                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                          >
                            <span>Open Student Learning View</span>
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

        {/* MODAL: PARENT CONTROLS */}
        {showControlsModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 flex flex-col gap-5 animate-scaleUp">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-headline-parent-md text-lg font-bold text-slate-900">
                      Parent Controls & PIN Configuration
                    </h3>
                    <p className="text-xs text-slate-500">Manage answer gating, screen time limits, and learning goals.</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowControlsModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveControls} className="flex flex-col gap-4 text-xs">
                {/* 1. PIN Gate Policy */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">Require Parent PIN for Final Solutions</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Ensures children walk through guided learning and mini-quizzes before seeing the answers.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={requirePinToggle}
                    onChange={(e) => setRequirePinToggle(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                </div>

                {/* 2. Guardian PIN */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-800">4-Digit Guardian PIN:</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-base font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-[10px] text-slate-400">Used by child to request solution unlocks. Default is 1234.</span>
                </div>

                {/* 3. Screen Time Limits */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-800">Daily Screen Time Limit (Minutes):</label>
                  <select
                    value={screenTimeInput}
                    onChange={(e) => setScreenTimeInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value={30}>30 Minutes / Day</option>
                    <option value={45}>45 Minutes / Day (Recommended)</option>
                    <option value={60}>60 Minutes / Day</option>
                    <option value={90}>90 Minutes / Day</option>
                    <option value={120}>Unlimited</option>
                  </select>
                </div>

                {/* 4. Weekly Learning Goal */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-800">Weekly Learning Goal (Sessions):</label>
                  <select
                    value={weeklyGoalInput}
                    onChange={(e) => setWeeklyGoalInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value={2}>2 Sessions / Week</option>
                    <option value={3}>3 Sessions / Week</option>
                    <option value={4}>4 Sessions / Week (Target)</option>
                    <option value={5}>5 Sessions / Week</option>
                  </select>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowControlsModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingControls}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm transition-all"
                  >
                    Save Preferences
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ParentDashboard;
