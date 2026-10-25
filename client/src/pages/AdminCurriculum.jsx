import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ArrowLeft, BookOpen, Plus, Sliders, CheckCircle, ShieldCheck, X } from "lucide-react";

export function AdminCurriculum() {
  const { setCurrentView, showToast } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [standardBody, setStandardBody] = useState("Common Core State Standards (CCSS)");
  const [gradeBand, setGradeBand] = useState("Grades 1–5");

  const [subjectsList, setSubjectsList] = useState([
    { name: "Mathematics", standard: "CCSS.MATH (Grades 1–12)", topicsCount: 142, status: "Active", benchmark: "National Standard" },
    { name: "English Language Arts", standard: "CCSS.ELA (Grades 1–12)", topicsCount: 118, status: "Active", benchmark: "National Standard" },
    { name: "Science", standard: "NGSS (Next Gen Science)", topicsCount: 96, status: "Active", benchmark: "Inquiry Framework" },
    { name: "Social Studies & Civics", standard: "State Framework / C3", topicsCount: 64, status: "Active", benchmark: "State Standard" },
    { name: "World Languages", standard: "ACTFL Proficiency Scale", topicsCount: 52, status: "Active", benchmark: "Novice to Intermediate" }
  ]);

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    setSubjectsList([
      ...subjectsList,
      {
        name: newSubject,
        standard: standardBody,
        topicsCount: 24,
        status: "Active",
        benchmark: "Configured Standard"
      }
    ]);
    showToast(`Added subject ${newSubject} to curriculum catalog.`);
    setDrawerOpen(false);
    setNewSubject("");
  };

  return (
    <div className="w-full min-h-screen bg-[#F6F8FB] text-[#1C2B45] py-8 px-4 sm:px-8">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView("parent-dashboard")}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <div>
              <h1 className="font-headline-parent-lg text-2xl font-bold text-parent-ink">
                Admin Console: Curriculum & Subject Suite
              </h1>
              <p className="text-xs text-slate-500">
                Configure grade-band standards, OCR prompt rules, and state benchmark mappings.
              </p>
            </div>
          </div>

          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary hover:bg-sky-800 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Subject</span>
          </button>
        </div>

        {/* Subjects Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-600">
              Configured Subject Frameworks ({subjectsList.length})
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ✓ Standards Aligned
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {subjectsList.map((item, idx) => (
              <div key={idx} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 text-primary-container flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.standard} • {item.topicsCount} mapped competencies</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                    {item.benchmark}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Subject Drawer Modal */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md h-full p-6 sm:p-8 shadow-2xl flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <h3 className="font-bold text-xl text-parent-ink">
                    Configure New Subject
                  </h3>
                  <button onClick={() => setDrawerOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddSubject} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Subject Name
                    </label>
                    <input
                      type="text"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      placeholder="e.g. Computer Science & Coding"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Standards Framework
                    </label>
                    <select
                      value={standardBody}
                      onChange={(e) => setStandardBody(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-primary"
                    >
                      <option>Common Core State Standards (CCSS)</option>
                      <option>Next Generation Science Standards (NGSS)</option>
                      <option>Texas Essential Knowledge and Skills (TEKS)</option>
                      <option>California State Board Standards</option>
                      <option>C3 Framework for Social Studies</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Target Grade Band
                    </label>
                    <select
                      value={gradeBand}
                      onChange={(e) => setGradeBand(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-primary"
                    >
                      <option>Grades 1–5 (Elementary)</option>
                      <option>Grades 6–8 (Middle School)</option>
                      <option>Grades 9–12 (High School)</option>
                      <option>Grades 1–12 (Comprehensive)</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-primary hover:bg-sky-800 text-white font-bold text-sm shadow-md"
                    >
                      Save & Publish Subject
                    </button>
                  </div>
                </form>
              </div>

              <div className="text-[11px] text-slate-400 pt-6 border-t border-slate-100">
                Configured standards will automatically apply to AI teacher prompt generation.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
