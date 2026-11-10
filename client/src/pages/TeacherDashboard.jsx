import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Users,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Download,
  Search,
  Filter,
  FileText,
  Award,
  Sparkles,
  LogOut,
  ChevronRight,
  Eye,
  MessageSquare,
  TrendingUp,
  ShieldCheck,
  Printer
} from "lucide-react";

export function TeacherDashboard() {
  const { currentUser, sessions, childrenList, API_BASE, showToast, logout, setCurrentView, setActiveSession, getChildEmoji } = useApp();

  const [activeTab, setActiveTab] = useState("submissions"); // 'submissions' | 'students' | 'progress' | 'reports'
  const [submissionsList, setSubmissionsList] = useState(sessions);
  const [selectedSubmission, setSelectedSubmission] = useState(sessions[0] || null);
  const [teacherGuidanceNote, setTeacherGuidanceNote] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [studentFilter, setStudentFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");

  const teacherName = currentUser?.name || "Mr. Robert Davis";
  const teacherSchool = currentUser?.school || "Lincoln Elementary School";
  const teacherSubject = currentUser?.subject || "5th Grade Math & Science Lead";

  // Refresh submissions from server
  const fetchSubmissions = async () => {
    try {
      const res = await fetch(`${API_BASE}/teacher/submissions`);
      const data = await res.json();
      if (data.success && data.submissions?.length > 0) {
        setSubmissionsList(data.submissions);
        if (!selectedSubmission) setSelectedSubmission(data.submissions[0]);
      }
    } catch (err) {
      console.warn("Could not fetch remote teacher submissions, using local state:", err);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleSendGuidance = async () => {
    if (!selectedSubmission || !teacherGuidanceNote.trim()) {
      showToast("Please write a guidance note first.", "error");
      return;
    }

    setIsSubmittingNote(true);
    try {
      const res = await fetch(`${API_BASE}/teacher/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: selectedSubmission.id,
          studentId: selectedSubmission.childId,
          teacherName,
          message: teacherGuidanceNote
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmissionsList(prev => prev.map(s => s.id === selectedSubmission.id ? { ...s, teacherInstructionNote: `Teacher Note: ${teacherGuidanceNote}` } : s));
        setSelectedSubmission(prev => ({ ...prev, teacherInstructionNote: `Teacher Note: ${teacherGuidanceNote}` }));
        showToast("Teacher guidance note delivered to student & parent!");
        setTeacherGuidanceNote("");
      }
    } catch (err) {
      setSubmissionsList(prev => prev.map(s => s.id === selectedSubmission.id ? { ...s, teacherInstructionNote: `Teacher Note: ${teacherGuidanceNote}` } : s));
      setSelectedSubmission(prev => ({ ...prev, teacherInstructionNote: `Teacher Note: ${teacherGuidanceNote}` }));
      showToast("Teacher guidance note delivered to student & parent!");
      setTeacherGuidanceNote("");
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const filteredSubmissions = submissionsList.filter(s => {
    const matchChild = studentFilter === "all" || s.childId === studentFilter;
    const matchSub = subjectFilter === "all" || s.subject.toLowerCase() === subjectFilter.toLowerCase();
    return matchChild && matchSub;
  });

  return (
    <div className="w-full min-h-screen bg-[#F0F5FA] text-slate-900 py-8 px-4 sm:px-8">
      <div className="max-w-[1300px] mx-auto flex flex-col gap-6">

        {/* Top Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-3xl shadow-md">
              👨‍🏫
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-headline-parent-lg text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {teacherName}
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>State Certified Teacher</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {teacherSchool} • {teacherSubject} • Assigned Class Roster: 24 Students
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentView("worksheet")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all"
            >
              <Printer className="w-4 h-4 text-amber-600" />
              <span>Worksheet Generator</span>
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "submissions", label: "Homework Submissions", icon: FileText, badge: submissionsList.length },
            { id: "students", label: "Assigned Students", icon: Users, badge: childrenList.length },
            { id: "progress", label: "Curriculum Standards Progress", icon: Award },
            { id: "reports", label: "Class Reports & Analytics", icon: TrendingUp }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shadow-xs ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md scale-[1.02]"
                    : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: SUBMISSIONS REVIEW & GUIDANCE */}
        {activeTab === "submissions" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            {/* Left Submissions List */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider">
                  Submitted Homework Queue ({filteredSubmissions.length})
                </h3>
                <div className="flex items-center gap-2">
                  <select
                    value={studentFilter}
                    onChange={(e) => setStudentFilter(e.target.value)}
                    className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1"
                  >
                    <option value="all">All Students</option>
                    {childrenList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
                {filteredSubmissions.map(sub => {
                  const isSelected = selectedSubmission?.id === sub.id;
                  const isReview = sub.status === "needs_review";

                  return (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedSubmission(sub)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-blue-50/80 border-blue-400 shadow-sm"
                          : "bg-slate-50 hover:bg-slate-100 border-slate-200/80"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{getChildEmoji(childrenList.find(c => c.id === sub.childId)?.avatar)}</span>
                          <span className="font-bold text-slate-900 text-sm">{sub.childName}</span>
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">Grade {sub.grade}</span>
                        </div>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          isReview ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {isReview ? "Needs Review" : "Mastered"}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-slate-800 mb-1">{sub.topic}</div>
                      <div className="text-[11px] text-slate-500 flex items-center justify-between">
                        <span>{sub.subject} • {sub.standard?.code || "CCSS Aligned"}</span>
                        <span className="font-mono">{sub.date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Submission Detail & Feedback Composer */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between gap-6">
              {selectedSubmission ? (
                <>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                            {selectedSubmission.subject} • Grade {selectedSubmission.grade}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">{selectedSubmission.date}</span>
                        </div>
                        <h2 className="font-headline-parent-md text-2xl font-extrabold text-slate-900">
                          {selectedSubmission.topic}
                        </h2>
                        <p className="text-xs text-slate-600 mt-1">
                          Student: <strong className="text-slate-900">{selectedSubmission.childName}</strong> • Standard: <strong className="text-indigo-700">{selectedSubmission.standard?.code}</strong> ({selectedSubmission.standard?.title})
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setActiveSession(selectedSubmission);
                          setCurrentView("explanation");
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-all border border-blue-200"
                        title="View Student Learning Layout"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Student View</span>
                      </button>
                    </div>

                    {/* Original Worksheet Preview thumbnail if attached */}
                    {(selectedSubmission.fileUrl || selectedSubmission.fileUrls?.length > 0) && (
                      <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <img
                          src={selectedSubmission.fileUrl || selectedSubmission.fileUrls[0]}
                          alt="Homework page"
                          className="w-16 h-16 object-cover rounded-xl border border-slate-300"
                          onError={(e) => { e.currentTarget.src = "/assets/sample_math_worksheet.png"; }}
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-800">Uploaded Homework Page</div>
                          <p className="text-[11px] text-slate-500">Processed through Multimodal OCR & Socratic Reasoning</p>
                        </div>
                      </div>
                    )}

                    {/* Diagnostic Summary */}
                    <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-4 text-xs text-sky-950 flex flex-col gap-2">
                      <div className="font-bold text-sky-900">Diagnostic Summary for Educator:</div>
                      <div>• <strong>Child Strengths:</strong> {selectedSubmission.parentSummary?.childStrengths || "Fluently executes standard vertical alignment."}</div>
                      <div>• <strong>Struggle Points:</strong> {selectedSubmission.parentSummary?.strugglePoints || "Carrying over 10s column threshold."}</div>
                      <div>• <strong>At-Home Practice:</strong> {selectedSubmission.parentSummary?.atHomeHelpTips || "Use physical place value models."}</div>
                    </div>

                    {/* Existing Teacher Note if any */}
                    {selectedSubmission.teacherInstructionNote && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900">
                        <strong>Current Note:</strong> {selectedSubmission.teacherInstructionNote}
                      </div>
                    )}
                  </div>

                  {/* Send Teacher Guidance Composer */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      <span>Provide Teacher Guidance / Encouragement Note</span>
                    </label>

                    <textarea
                      rows={3}
                      value={teacherGuidanceNote}
                      onChange={(e) => setTeacherGuidanceNote(e.target.value)}
                      placeholder={`Write a friendly guidance note for ${selectedSubmission.childName} and their parents... (e.g. Great job regrouping! Keep practicing with tens blocks tonight!)`}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        Note will appear directly on the student's lesson view and parent diagnostic summary.
                      </span>

                      <button
                        onClick={handleSendGuidance}
                        disabled={isSubmittingNote || !teacherGuidanceNote.trim()}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Guidance</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs">
                  Select a homework submission from the left queue to review and provide guidance.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ASSIGNED STUDENTS ROSTER */}
        {activeTab === "students" && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col gap-6 animate-fadeIn">
            <div>
              <h3 className="font-headline-parent-md text-xl font-bold text-slate-900">
                Classroom Student Roster ({childrenList.length} Monitored)
              </h3>
              <p className="text-xs text-slate-500">
                Track learning streaks, homework frequency, and active academic focus areas for each student.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {childrenList.map((child) => (
                <div key={child.id} className="bg-slate-50 rounded-3xl p-5 border border-slate-200 flex flex-col justify-between gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl border border-amber-200 shadow-xs">
                        {getChildEmoji(child.avatar)}
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-slate-900">{child.name}</h4>
                        <p className="text-xs text-slate-500">Grade {child.grade} • {child.track || "Standard Track"}</p>
                      </div>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                      {child.streak || 4} Day Streak 🔥
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 text-xs text-slate-700 bg-white p-3.5 rounded-2xl border border-slate-100">
                    <div><strong>Active Focus:</strong> <span className="text-slate-900">{child.activeFocus || "General Math & Science"}</span></div>
                    <div><strong>Weekly Homework Volume:</strong> {child.weeklySessions || 3} sessions completed</div>
                    <div><strong>Independence Autonomy Score:</strong> <span className="font-bold text-blue-700">{child.autonomyScore || 85}%</span></div>
                  </div>

                  <button
                    onClick={() => {
                      setStudentFilter(child.id);
                      setActiveTab("submissions");
                    }}
                    className="w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Review {child.name}'s Homework</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CURRICULUM STANDARDS PROGRESS */}
        {activeTab === "progress" && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col gap-6 animate-fadeIn">
            <div>
              <h3 className="font-headline-parent-md text-xl font-bold text-slate-900">
                Grade-Band Standards Mastery Distribution
              </h3>
              <p className="text-xs text-slate-500">
                Benchmark evaluation aligned with Common Core State Standards (CCSS) and Next Generation Science Standards (NGSS).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { domain: "CCSS Math: Base Ten Addition & Place Value", standard: "3.NBT.A.2", mastery: "88%", status: "On Track", color: "bg-sky-500", studentsCount: "18 / 24 Proficient" },
                { domain: "CCSS Math: Fractions Comparison & Equivalence", standard: "4.NF.A.2", mastery: "79%", status: "In Progress", color: "bg-amber-500", studentsCount: "14 / 24 Proficient" },
                { domain: "NGSS Science: Cellular Organelles & Function", standard: "MS-LS1-2", mastery: "84%", status: "On Track", color: "bg-emerald-500", studentsCount: "16 / 24 Proficient" },
                { domain: "CCSS ELA: Main Idea & Supporting Evidence", standard: "RI.3.2", mastery: "92%", status: "Mastered", color: "bg-indigo-500", studentsCount: "22 / 24 Proficient" },
                { domain: "NGSS Science: Photosynthesis vs Respiration", standard: "MS-LS1-6", mastery: "72%", status: "Needs Review", color: "bg-rose-500", studentsCount: "11 / 24 Proficient" },
                { domain: "CCSS Math: Multi-Step Word Problems", standard: "3.OA.D.8", mastery: "81%", status: "In Progress", color: "bg-purple-500", studentsCount: "15 / 24 Proficient" }
              ].map((std, i) => (
                <div key={i} className="p-5 rounded-3xl border border-slate-200 bg-slate-50 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono font-bold text-indigo-700">{std.standard}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        std.status === "Mastered" ? "bg-emerald-100 text-emerald-800" :
                        std.status === "On Track" ? "bg-sky-100 text-sky-800" :
                        std.status === "In Progress" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                      }`}>
                        {std.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{std.domain}</h4>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-600">{std.studentsCount}</span>
                      <span className="text-slate-900">{std.mastery}</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div style={{ width: std.mastery }} className={`h-full rounded-full ${std.color}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CLASS REPORTS & ANALYTICS */}
        {activeTab === "reports" && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col gap-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline-parent-md text-xl font-bold text-slate-900">
                  Class Progress & Diagnostic Report
                </h3>
                <p className="text-xs text-slate-500">
                  Detailed analytics on classroom question trends, struggle areas, and teacher guidance efficiency.
                </p>
              </div>

              <button
                onClick={() => {
                  window.print();
                  showToast("Print preview launched!");
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Class PDF</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 bg-sky-50 border border-sky-200 rounded-3xl">
                <div className="text-xs font-bold text-sky-800 uppercase">Class Autonomy Index</div>
                <div className="text-3xl font-extrabold text-sky-950 mt-1">84.2%</div>
                <p className="text-xs text-sky-700 mt-1">Percentage of homework solved with hints rather than full reveals.</p>
              </div>

              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-3xl">
                <div className="text-xs font-bold text-emerald-800 uppercase">Homework Completion</div>
                <div className="text-3xl font-extrabold text-emerald-950 mt-1">96.8%</div>
                <p className="text-xs text-emerald-700 mt-1">38 out of 40 weekly homework tasks submitted on schedule.</p>
              </div>

              <div className="p-5 bg-amber-50 border border-amber-200 rounded-3xl">
                <div className="text-xs font-bold text-amber-800 uppercase">Teacher Feedback Impact</div>
                <div className="text-3xl font-extrabold text-amber-950 mt-1">+19% Retest Boost</div>
                <p className="text-xs text-amber-700 mt-1">Students show 19% higher retention after teacher guidance notes.</p>
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Educator Summary:</strong> In the last 30 days, your students engaged with {submissionsList.length} homework breakdowns across Mathematics and Natural Sciences. The platform's PIN-gated solution policy has cut passive answer copying to 0%, ensuring students first master the Common Core step-by-step principles.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default TeacherDashboard;

