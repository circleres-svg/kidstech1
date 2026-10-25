import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ArrowLeft, Award, TrendingUp, CheckCircle, AlertCircle, Sparkles, BookOpen } from "lucide-react";

export function MasteryReport() {
  const { childrenList, setCurrentView } = useApp();
  const [selectedChildId, setSelectedChildId] = useState(childrenList[0]?.id || "child-1");

  const child = childrenList.find(c => c.id === selectedChildId) || childrenList[0];

  const subjects = React.useMemo(() => {
    const gr = child?.grade || 3;
    if (gr >= 6) {
      return [
        {
          name: "Math",
          score: 82,
          benchmark: "Proficient",
          standard: "CCSS.MATH.CONTENT.7.RP.A.2",
          domain: "Ratios & Proportional Relationships",
          trend: "+5% this month",
          color: "bg-sky-500",
          textColor: "text-sky-700"
        },
        {
          name: "Reading-Writing",
          score: 87,
          benchmark: "Advanced",
          standard: "CCSS.ELA-LITERACY.RL.7.1",
          domain: "Textual Evidence & Inferences",
          trend: "+7% this month",
          color: "bg-amber-500",
          textColor: "text-amber-700"
        },
        {
          name: "Science",
          score: 76,
          benchmark: "Approaching Target",
          standard: "NGSS.MS-LS1-2",
          domain: "Cellular Structure & Organelle Functions",
          trend: "Needs review on ATP / chloroplasts",
          color: "bg-emerald-500",
          textColor: "text-emerald-700"
        },
        {
          name: "Social Studies",
          score: 90,
          benchmark: "Advanced",
          standard: "STATE.SS.7.H.3",
          domain: "Civics & Constitutional History",
          trend: "Consistently proficient",
          color: "bg-rose-500",
          textColor: "text-rose-700"
        },
        {
          name: "Languages",
          score: 84,
          benchmark: "Proficient",
          standard: "ACTFL.NH.2",
          domain: "Connected Conversational Dialogue",
          trend: "+8% grammar retention",
          color: "bg-purple-500",
          textColor: "text-purple-700"
        }
      ];
    } else if (gr <= 2) {
      return [
        {
          name: "Math",
          score: 94,
          benchmark: "Advanced Mastery",
          standard: "CCSS.MATH.CONTENT.1.OA.A.1",
          domain: "Addition & Subtraction within 20",
          trend: "+12% this month",
          color: "bg-sky-500",
          textColor: "text-sky-700"
        },
        {
          name: "Reading-Writing",
          score: 91,
          benchmark: "Advanced Mastery",
          standard: "CCSS.ELA-LITERACY.RL.1.1",
          domain: "Phonics, CVC Rhyming & Story Details",
          trend: "+9% this month",
          color: "bg-amber-500",
          textColor: "text-amber-700"
        },
        {
          name: "Science",
          score: 85,
          benchmark: "Proficient",
          standard: "NGSS.1-LS1-1",
          domain: "Structure & Function in Living Things",
          trend: "Great curiosity & observations",
          color: "bg-emerald-500",
          textColor: "text-emerald-700"
        },
        {
          name: "Social Studies",
          score: 96,
          benchmark: "Advanced Mastery",
          standard: "STATE.SS.1.C.1",
          domain: "Family & Community Cooperation",
          trend: "High engagement",
          color: "bg-rose-500",
          textColor: "text-rose-700"
        },
        {
          name: "Languages",
          score: 88,
          benchmark: "Proficient",
          standard: "ACTFL.NL.1",
          domain: "Basic Song & Word Recognition",
          trend: "+15% retention",
          color: "bg-purple-500",
          textColor: "text-purple-700"
        }
      ];
    }

    return [
      {
        name: "Math",
        score: 88,
        benchmark: "Proficient",
        standard: "CCSS.MATH.CONTENT.3.NBT.A.2",
        domain: "Number & Operations in Base Ten",
        trend: "+6% this month",
        color: "bg-sky-500",
        textColor: "text-sky-700"
      },
      {
        name: "Reading-Writing",
        score: 85,
        benchmark: "Proficient",
        standard: "CCSS.ELA-LITERACY.RI.3.2",
        domain: "Informational Text & Main Idea",
        trend: "+4% this month",
        color: "bg-amber-500",
        textColor: "text-amber-700"
      },
      {
        name: "Science",
        score: 79,
        benchmark: "Approaching Target",
        standard: "NGSS.3-LS1-1 / MS-LS1-2",
        domain: "Life Sciences & Cellular Structure",
        trend: "Review needed on energy organelles",
        color: "bg-emerald-500",
        textColor: "text-emerald-700"
      },
      {
        name: "Social Studies",
        score: 92,
        benchmark: "Advanced Mastery",
        standard: "STATE.SS.3.G.1",
        domain: "Geography & Civic Communities",
        trend: "Consistent high performance",
        color: "bg-rose-500",
        textColor: "text-rose-700"
      },
      {
        name: "Languages",
        score: 80,
        benchmark: "Proficient",
        standard: "ACTFL.NM.1",
        domain: "Vocabulary & Listening Comprehension",
        trend: "+10% vocabulary retention",
        color: "bg-purple-500",
        textColor: "text-purple-700"
      }
    ];
  }, [child?.grade]);

  return (
    <div className="w-full min-h-screen bg-[#F6F8FB] text-[#1C2B45] py-8 px-4 sm:px-8">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-6">
        
        {/* Navigation & Child Switcher Bar */}
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
                Standards Mastery & Progress
              </h1>
              <p className="text-xs text-slate-500">
                Common Core (Math/ELA) and Next Generation Science Standards (NGSS) tracking
              </p>
            </div>
          </div>

          {/* Child Picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Viewing Child:</span>
            <div className="inline-flex bg-slate-100 p-1 rounded-xl">
              {childrenList.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedChildId(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedChildId === c.id
                      ? "bg-parent-teal text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {c.name} (Gr {c.grade})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Top Summary Stat Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-parent-teal">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Overall Grade {child?.grade} Mastery
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-parent-ink">84%</span>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  On Track
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-primary-container">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Learning Velocity
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-parent-ink">+8.4%</span>
                <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                  Past 30 Days
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-parent-accent">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Independent Autonomy
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-parent-ink">{child?.autonomyScore || 88}%</span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  High Confidence
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Subject Standards Breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <h2 className="font-headline-parent-lg text-xl font-bold text-parent-ink mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-parent-teal" />
            <span>Curriculum Standards Proficiency breakdown</span>
          </h2>

          <div className="space-y-6">
            {subjects.map((s) => (
              <div key={s.name} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-base text-slate-900">{s.name}</span>
                    <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                      {s.standard}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500">{s.trend}</span>
                    <span className="text-xs font-bold text-parent-ink">{s.score}%</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mb-3">{s.domain}</p>

                {/* Progress bar */}
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${s.color} rounded-full transition-all duration-500`}
                    style={{ width: `${s.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
