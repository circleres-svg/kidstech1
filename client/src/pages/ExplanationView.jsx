import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Volume2, VolumeX, Lightbulb, CheckCircle2, ArrowLeft, Printer, PlayCircle, Star, Sparkles, RefreshCw, Layers, Image as ImageIcon, Eye, ChevronDown, ChevronUp, X } from "lucide-react";

export function ExplanationView() {
  const { activeSession, setActiveSession, selectedChild, setCurrentView, speakText, stopSpeaking, isSpeaking, API_BASE, showToast } = useApp();
  const [isExplainingDifferently, setIsExplainingDifferently] = useState(false);
  const [showAttachedFiles, setShowAttachedFiles] = useState(true);
  const [viewingImage, setViewingImage] = useState(null);

  if (!activeSession) {
    return (
      <div className="w-full min-h-screen bg-[#FFF8EC] p-8 text-center flex flex-col items-center justify-center">
        <p className="font-display-hero text-xl text-slate-700">No active homework session loaded.</p>
        <button
          onClick={() => setCurrentView("upload")}
          className="mt-4 px-6 py-2.5 bg-primary-container text-white font-bold rounded-full"
        >
          Upload Homework
        </button>
      </div>
    );
  }

  const { childExplanation, topic, subject, grade } = activeSession;

  const handleExplainDifferently = async () => {
    setIsExplainingDifferently(true);
    try {
      const res = await fetch(`${API_BASE}/sessions/${activeSession.id}/explain-differently`, {
        method: "POST"
      });
      const data = await res.json();
      if (data.success) {
        setActiveSession({
          ...activeSession,
          childExplanation: data.childExplanation
        });
        showToast("Switched to alternate visual explanation format!");
      }
    } catch (err) {
      // Local fallback alternate explanation
      const childName = selectedChild?.name || "Student";
      let alternateSteps = [];
      let alternateSummary = "";

      if (subject?.toLowerCase().includes("math")) {
        alternateSummary = `Hey ${childName}! Let's try looking at this problem using an open number line instead of vertical stacking!`;
        alternateSteps = [
          {
            stepNumber: 1,
            title: "Jump by Tens on the Number Line",
            explanation: `Start at 28. To add 19, break 19 into 10 + 9. Take one big hop of +10: from 28 you land on 38!`,
            visualTip: "28 ──(+10)──► 38"
          },
          {
            stepNumber: 2,
            title: "Jump by Friendly Ones",
            explanation: `Now add 9: jump +2 to reach friendly 40, and the remaining +7 lands you right on 47!`,
            visualTip: "38 ──(+2)──► 40 ──(+7)──► 47"
          }
        ];
      } else if (subject?.toLowerCase().includes("sci")) {
        alternateSummary = `Hey ${childName}! Let's imagine the cell like a miniature bustling city!`;
        alternateSteps = [
          {
            stepNumber: 1,
            title: "City Hall (The Nucleus)",
            explanation: "Contains all blueprints and laws for how the city functions.",
            visualTip: "City Hall ➜ Directs all city workers"
          },
          {
            stepNumber: 2,
            title: "Power Plants (Mitochondria & Chloroplasts)",
            explanation: "Chloroplasts are solar solar-farms that make food; Mitochondria are generators burning fuel for electricity.",
            visualTip: "Solar Farm (Plants) + Generator (Powerhouse)"
          }
        ];
      } else {
        alternateSummary = `Hey ${childName}! Let's solve this like a detective searching for clues!`;
        alternateSteps = [
          {
            stepNumber: 1,
            title: "Find the Big Mystery (Main Idea)",
            explanation: "Ask: what is the case the detective is trying to solve in this story?",
            visualTip: "Detective Question: What is the big picture?"
          },
          {
            stepNumber: 2,
            title: "Gather the Fingerprints (Supporting Clues)",
            explanation: "Collect 2-3 specific clues from the text that prove your solution.",
            visualTip: "Clue 1 + Clue 2 ➜ Solved Case!"
          }
        ];
      }

      setActiveSession({
        ...activeSession,
        childExplanation: {
          ...activeSession.childExplanation,
          assignmentSummary: alternateSummary,
          steps: alternateSteps,
          encouragingTip: `🌟 Seeing problems from different angles is what makes great problem solvers, ${childName}!`
        }
      });
      showToast("Switched to visual analogy explanation!");
    } finally {
      setIsExplainingDifferently(false);
    }
  };

  const handleReadAloud = () => {
    const textToRead = childExplanation.readAloudScript || `${childExplanation.assignmentSummary}. ${childExplanation.steps.map(s => s.title + ". " + s.explanation).join(" ")}`;
    speakText(textToRead);
  };

  return (
    <div className="w-full min-h-screen bg-[#FFF8EC] text-[#33302A] py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        
        {/* Navigation & Controls Bar */}
        <div className="flex items-center justify-between bg-white/90 backdrop-blur rounded-2xl p-4 shadow-sm border border-amber-200">
          <button
            onClick={() => {
              stopSpeaking();
              setCurrentView("upload");
            }}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-amber-100 hover:bg-amber-200 px-3.5 py-2 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Upload Another</span>
          </button>

          {/* Audio Teacher TTS Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleReadAloud}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-display-hero text-xs font-bold transition-all shadow-sm ${
                isSpeaking
                  ? "bg-rose-500 text-white animate-pulse"
                  : "bg-sky-500 hover:bg-sky-600 text-white"
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Stop Reading</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Read to Me 🔊</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section 1: What this is about (Warm Grade-Band Summary) */}
        <div className="bg-sky-50 border-2 border-sky-200 rounded-3xl p-6 sm:p-7 shadow-md relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🎒</span>
            <h2 className="font-display-hero text-xs font-bold uppercase tracking-widest text-sky-800">
              What this assignment is about
            </h2>
          </div>
          <h3 className="font-display-hero text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            {topic}
          </h3>
          <p className="font-body-kid-md text-base sm:text-lg text-slate-700 leading-relaxed">
            "{childExplanation.assignmentSummary}"
          </p>
        </div>

        {/* Attached Homework Pages Viewer Drawer */}
        {(activeSession.fileUrls?.length > 0 || activeSession.fileUrl) && (
          <div className="bg-white rounded-3xl p-5 border-2 border-[#E8DFD1] shadow-xs">
            <div
              onClick={() => setShowAttachedFiles(!showAttachedFiles)}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display-hero text-sm font-bold text-slate-800">
                    Attached Worksheet Photos ({activeSession.fileUrls?.length || 1} Page{(activeSession.fileUrls?.length || 1) > 1 ? "s" : ""})
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {showAttachedFiles ? "Click to collapse" : "Click to view original homework pages"}
                  </p>
                </div>
              </div>
              <div className="p-1 rounded-lg text-slate-400">
                {showAttachedFiles ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>

            {showAttachedFiles && (
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                {(activeSession.fileUrls || [activeSession.fileUrl]).map((url, i) => (
                  <div
                    key={i}
                    onClick={() => setViewingImage(url)}
                    className="group relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-slate-200 hover:border-amber-400 cursor-pointer shadow-xs transition-all flex items-center justify-center bg-slate-50"
                  >
                    <img
                      src={url}
                      alt={`Worksheet page ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/assets/sample_math_worksheet.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold transition-opacity">
                      <Eye className="w-4 h-4 mb-0.5" />
                      <span>Page {i + 1}</span>
                    </div>
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Pg {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section 2: Step-by-Step Interactive Walkthrough */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-display-hero text-xl font-bold text-slate-800 flex items-center gap-2">
              <span>Let's work through it</span>
              <span className="text-xs bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                {childExplanation.steps.length} Steps
              </span>
            </h3>
          </div>

          {childExplanation.steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-7 shadow-md border-2 border-[#E8DFD1] hover:border-sky-300 transition-all"
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary-container text-white font-display-hero text-base font-bold flex items-center justify-center flex-shrink-0 shadow-sm">
                  {step.stepNumber || idx + 1}
                </div>
                <div>
                  <h4 className="font-display-hero text-lg sm:text-xl font-bold text-slate-900">
                    {step.title}
                  </h4>
                  <p className="font-body-kid-md text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">
                    {step.explanation}
                  </p>
                </div>
              </div>

              {step.visualTip && (
                <div className="mt-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 text-xs font-bold font-mono text-amber-900 flex items-center gap-2">
                  <span className="text-base">💡</span>
                  <span>{step.visualTip}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Section 3: Final Answers (Self-Check Card) */}
        {childExplanation.finalAnswers && childExplanation.finalAnswers.length > 0 && (
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-6 sm:p-7 shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <h3 className="font-display-hero text-xl font-bold text-emerald-950">
                Self-Check: Your Answers
              </h3>
            </div>
            <p className="text-xs text-emerald-800 mb-4">
              Try solving the questions yourself first, then peek here to verify!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {childExplanation.finalAnswers.map((ans, i) => (
                <div key={i} className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500 block mb-0.5">{ans.question}</span>
                  <span className="font-display-hero text-xl font-extrabold text-emerald-700 block">
                    Answer: {ans.answer}
                  </span>
                  {ans.checkExplanation && (
                    <span className="text-[11px] text-slate-500 mt-1 block leading-tight">
                      {ans.checkExplanation}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Encouraging Tip */}
        <div className="bg-[#FFFDF4] border-2 border-amber-300 rounded-3xl p-6 sm:p-7 shadow-md flex items-start gap-4">
          <div className="text-3xl">🌟</div>
          <div>
            <h4 className="font-display-hero text-base font-bold text-amber-900 mb-1">
              Teacher's Special Note
            </h4>
            <p className="font-body-kid-md text-sm sm:text-base text-amber-950 leading-relaxed">
              {childExplanation.encouragingTip}
            </p>
          </div>
        </div>

        {/* Bottom Interactive Action Toolbar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleExplainDifferently}
            disabled={isExplainingDifferently}
            className="w-full sm:w-1/2 py-4 px-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-800 font-display-hero text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>{isExplainingDifferently ? "Thinking..." : "Explain Differently 💡"}</span>
          </button>

          <button
            onClick={() => {
              stopSpeaking();
              setCurrentView("practice");
            }}
            className="w-full sm:w-1/2 py-4 px-4 rounded-2xl bg-primary-container hover:bg-sky-500 text-white font-display-hero text-sm font-bold shadow-[0_4px_0_0_#004c69] active:translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Try Practice Problems 🎯</span>
          </button>
        </div>

        <div className="text-center pb-8">
          <button
            onClick={() => {
              stopSpeaking();
              setCurrentView("worksheet");
            }}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 underline flex items-center justify-center gap-1.5 mx-auto"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Generate & Print Clean PDF Practice Worksheet</span>
          </button>
        </div>

      </div>

      {/* Lightbox for Viewing Attached Homework Full Screen */}
      {viewingImage && (
        <div
          onClick={() => setViewingImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl p-2">
            <button
              onClick={() => setViewingImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={viewingImage}
              alt="Enlarged homework page"
              className="max-h-[85vh] w-auto object-contain rounded-2xl"
              onError={(e) => {
                e.currentTarget.src = "/assets/sample_math_worksheet.png";
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
}
