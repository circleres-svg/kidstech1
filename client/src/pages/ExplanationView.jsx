import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import confetti from "canvas-confetti";
import {
  Volume2,
  VolumeX,
  Lightbulb,
  CheckCircle2,
  ArrowLeft,
  Star,
  Sparkles,
  RefreshCw,
  Image as ImageIcon,
  Eye,
  ChevronDown,
  ChevronUp,
  Lock,
  Unlock,
  ShieldCheck,
  Award,
  HelpCircle,
  Flame,
  Check,
  X
} from "lucide-react";

export function ExplanationView() {
  const {
    activeSession,
    setActiveSession,
    selectedChild,
    setCurrentView,
    speakText,
    stopSpeaking,
    isSpeaking,
    API_BASE,
    showToast,
    getChildEmoji,
    stars,
    addStars,
    points,
    addPoints,
    streak,
    badges,
    awardBadge,
    verifyAnswerPin,
    isAnswerUnlocked
  } = useApp();

  const [isExplainingDifferently, setIsExplainingDifferently] = useState(false);
  const [showAttachedFiles, setShowAttachedFiles] = useState(false);
  const [viewingImage, setViewingImage] = useState(null);

  // Progressive Hints State
  const [revealedHints, setRevealedHints] = useState([true, false, false]);

  // Mini Quiz State
  const [quizAnsweredIndex, setQuizAnsweredIndex] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // "I Understand" State
  const [hasUnderstood, setHasUnderstood] = useState(false);

  // Parent PIN Input State
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinSuccessAnimation, setPinSuccessAnimation] = useState(false);

  if (!activeSession) {
    return (
      <div className="w-full min-h-screen bg-[#FFF9F2] p-8 text-center flex flex-col items-center justify-center">
        <div className="text-5xl mb-3">🎒</div>
        <p className="font-display-hero text-xl text-slate-700">No active homework session loaded.</p>
        <button
          onClick={() => setCurrentView("upload")}
          className="mt-4 px-6 py-2.5 bg-primary-container text-white font-bold rounded-2xl shadow-md hover:bg-sky-600 transition-all"
        >
          Upload Homework
        </button>
      </div>
    );
  }

  const { childExplanation, topic, subject, grade, learningObjective, keyConcepts } = activeSession;
  const childName = selectedChild?.name || activeSession.childName || "Student";
  const childAvatar = selectedChild?.avatar || "bear";

  // Check if answer is unlocked for this session
  const answerUnlocked = isAnswerUnlocked(activeSession.id) || activeSession.parentApproved;

  // Toggle progressive hint
  const toggleHint = (idx) => {
    setRevealedHints(prev => {
      const copy = [...prev];
      copy[idx] = !copy[idx];
      return copy;
    });
  };

  // Handle Mini Quiz Option Select
  const handleQuizSelect = (optionIndex) => {
    if (quizSubmitted) return;
    setQuizAnsweredIndex(optionIndex);
    setQuizSubmitted(true);

    const miniQuiz = childExplanation?.miniQuiz;
    const isCorrect = miniQuiz ? optionIndex === miniQuiz.correctIndex : true;

    if (isCorrect) {
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
      addStars(3);
      addPoints(30);
      showToast("🎉 That's right! +3 Stars!", "success");
    } else {
      showToast("Almost! Check the hint above and try again.", "info");
    }
  };

  // Handle "I Understand" celebration
  const handleIUnderstand = () => {
    if (hasUnderstood) return;
    setHasUnderstood(true);
    try {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}

    addStars(5);
    addPoints(50);

    const badgeName = subject === "Math" ? "Math Champion" : subject === "Science" ? "Curious Scientist" : "Homework Hero";
    awardBadge({
      name: badgeName,
      icon: "⭐",
      desc: `Mastered ${topic}`
    });

    showToast("🌟 Great job! You understood the lesson steps! +5 Stars!", "success");

    // Smooth scroll down to parent PIN section
    setTimeout(() => {
      const pinEl = document.getElementById("parent-pin-section");
      if (pinEl) pinEl.scrollIntoView({ behavior: "smooth" });
    }, 400);
  };

  // Handle Parent PIN Submit
  const handlePinSubmit = (e) => {
    e.preventDefault();
    setPinError("");
    const ok = verifyAnswerPin(pinInput, activeSession.id);
    if (ok) {
      setPinSuccessAnimation(true);
      try {
        confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
      } catch (e) {}
      setPinInput("");
    } else {
      setPinError("Incorrect PIN. Please re-enter parent PIN.");
    }
  };

  const handleReadAloud = () => {
    const textToRead = childExplanation?.readAloudScript || `${childExplanation?.assignmentSummary || "Let's review the homework together."}. ${childExplanation?.steps?.map(s => s.title + ". " + s.explanation).join(" ") || ""}`;
    speakText(textToRead);
  };

  // Determine learning goal / objective
  const isFraction = Boolean(topic?.toLowerCase().includes("fraction"));
  const goalText = learningObjective || childExplanation?.learningObjective || (
    subject === "Math"
      ? (isFraction ? "Learn how to compare fractions with different denominators by finding common multiples." : "Master two-digit column addition with place-value regrouping.")
      : subject === "Science"
      ? "Identify microscopic cell organelles and distinguish plant cells from animal cells."
      : "Extract the central umbrella idea and identify supporting textual evidence."
  );

  // Determine key concepts
  const conceptTags = keyConcepts || childExplanation?.keyConcepts || (
    subject === "Math"
      ? (isFraction ? ["Common Denominators", "Equivalent Fractions", "Fraction Strips", "Cross Check"] : ["Place Value", "Tens & Ones Columns", "Carrying 10s to Roof", "Self Checking"])
      : subject === "Science"
      ? ["Cell Wall vs Membrane", "Chloroplasts (Photosynthesis)", "Mitochondria (ATP Energy)", "Nucleus Control"]
      : ["Umbrella Main Idea", "Supporting Evidence", "Context Clues", "Summary"]
  );

  // Progressive hints list
  const hintsList = childExplanation?.hints || [
    "Hint 1: Take your time reading what the question asks before calculating.",
    "Hint 2: Break the problem down into two simpler pieces.",
    "Hint 3: Double-check your work by thinking backwards!"
  ];

  // Visual examples list
  const visualExamplesList = childExplanation?.visualExamples || [
    {
      title: "Visual Model & Strategy Tip",
      diagram: subject === "Math"
        ? "Tens Column [10] | Ones Column [1]\n8 + 9 = 17 ➜ Keep 7 ones, trade 10 ones for 1 ten block on top!"
        : "Main Concept ➜ Step 1 ➜ Step 2 ➜ Solution"
    }
  ];

  // Mini quiz object
  const miniQuiz = childExplanation?.miniQuiz || {
    question: subject === "Math"
      ? "Quick Check: When you add 8 + 9 = 17, which digit do you carry to the tens roof?"
      : "Quick Check: What is the first thing we look for when breaking down this problem?",
    options: subject === "Math"
      ? ["Carry the 1 ten to the roof and write down the 7", "Write down 17 in the single ones box", "Ignore the 1 ten", "Subtract 8 from 9"]
      : ["The main umbrella objective", "The author's favorite color", "The page number", "Nothing, guess immediately"],
    correctIndex: 0,
    explanation: subject === "Math"
      ? "Exactly! 17 is 1 ten and 7 ones. You keep the 7 and carry the 1 ten!"
      : "Spot on! Always understand the main goal first!"
  };

  return (
    <div className="w-full min-h-screen bg-[#FFF9F2] text-[#2C2825] py-6 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        {/* Gamification Status Bar (Bright & Friendly) */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border-2 border-amber-200/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                stopSpeaking();
                setCurrentView("kids-switcher");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Hub</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shadow-xs">
                {getChildEmoji(childAvatar)}
              </div>
              <div>
                <div className="font-display-hero text-sm font-extrabold text-slate-900">{childName}</div>
                <div className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{streak} Day Streak!</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Stars Count */}
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 text-amber-900 px-3 py-1.5 rounded-2xl font-display-hero text-xs font-bold shadow-xs">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{stars} Stars</span>
            </div>

            {/* Points Count */}
            <div className="hidden sm:flex items-center gap-1 bg-sky-50 border border-sky-300 text-sky-900 px-3 py-1.5 rounded-2xl font-display-hero text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>{points} Pts</span>
            </div>

            {/* Audio Teacher TTS */}
            <button
              onClick={handleReadAloud}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl font-bold text-xs shadow-sm transition-all ${
                isSpeaking
                  ? "bg-rose-500 text-white animate-pulse"
                  : "bg-sky-500 hover:bg-sky-600 text-white"
              }`}
              title="Read lesson out loud"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isSpeaking ? "Stop" : "Read Aloud"}</span>
            </button>
          </div>
        </div>

        {/* Progress Flow Indicator (Kid-Friendly Educational Steps) */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-3 border border-amber-200 flex items-center justify-between text-xs font-bold text-slate-500">
          <div className="flex items-center gap-1 text-sky-700">
            <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">1</span>
            <span className="text-[11px]">Question</span>
          </div>
          <span className="text-slate-300">➜</span>
          <div className="flex items-center gap-1 text-sky-700">
            <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">2</span>
            <span className="text-[11px]">Learn</span>
          </div>
          <span className="text-slate-300">➜</span>
          <div className={`flex items-center gap-1 ${quizSubmitted ? "text-emerald-700" : "text-slate-600"}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white ${quizSubmitted ? "bg-emerald-600" : "bg-slate-400"}`}>3</span>
            <span className="text-[11px]">Mini Quiz</span>
          </div>
          <span className="text-slate-300">➜</span>
          <div className={`flex items-center gap-1 ${answerUnlocked ? "text-purple-700" : "text-amber-800"}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white ${answerUnlocked ? "bg-purple-600" : "bg-amber-500"}`}>4</span>
            <span className="text-[11px]">{answerUnlocked ? "Solved! ✓" : "Parent PIN"}</span>
          </div>
        </div>

        {/* 1. HOMEWORK QUESTION & WORKSHEET BANNER */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-md border-2 border-amber-200/90 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">📝</span>
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-800">
                Homework Question
              </span>
            </div>

            {(activeSession.fileUrls?.length > 0 || activeSession.fileUrl) && (
              <button
                onClick={() => setShowAttachedFiles(!showAttachedFiles)}
                className="flex items-center gap-1.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded-xl transition-all"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{showAttachedFiles ? "Hide Sheet" : "View Sheet Photos"}</span>
              </button>
            )}
          </div>

          <h2 className="font-display-hero text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            {topic}
          </h2>

          <p className="font-body-kid-md text-base text-slate-700 leading-relaxed">
            "{childExplanation?.assignmentSummary || "Let's work through this problem together step-by-step!"}"
          </p>

          {/* Attached Worksheet Photo Drawer */}
          {showAttachedFiles && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-3 animate-fadeIn">
              {(activeSession.fileUrls || [activeSession.fileUrl]).map((url, i) => (
                <div
                  key={i}
                  onClick={() => setViewingImage(url)}
                  className="group relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-300 hover:border-sky-500 cursor-pointer shadow-xs transition-all flex items-center justify-center bg-slate-50"
                >
                  <img
                    src={url}
                    alt={`Worksheet page ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = "/assets/sample_math_worksheet.png"; }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold transition-opacity">
                    <Eye className="w-4 h-4 mb-0.5" />
                    <span>Zoom Pg {i + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. WHAT IS THIS HOMEWORK ASKING? (Requirement #3 Step 3) */}
        <div className="bg-sky-50/90 border-2 border-sky-300 rounded-3xl p-6 sm:p-7 shadow-md flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <h3 className="font-display-hero text-xs font-bold uppercase tracking-widest text-sky-900">
                What is this homework asking?
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-sky-200 text-sky-900 text-xs font-extrabold px-3 py-1 rounded-full">
                {subject}
              </span>
              <span className="bg-white text-slate-800 text-xs font-bold px-3 py-1 rounded-full border border-sky-200">
                Grade {grade}
              </span>
            </div>
          </div>

          {/* Learning Objective / Goal Box */}
          <div className="bg-white p-4 rounded-2xl border-2 border-sky-200 shadow-xs flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-sky-800 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
              <span>Learning Objective (Goal)</span>
            </div>
            <p className="font-display-hero text-base sm:text-lg font-bold text-slate-900">
              {goalText}
            </p>
          </div>

          {/* Key Concepts Tags */}
          <div className="flex flex-col gap-2">
            <div className="text-xs font-bold text-sky-900 uppercase tracking-wider">
              Key Concepts & Vocabulary
            </div>
            <div className="flex flex-wrap gap-2">
              {conceptTags.map((concept, idx) => (
                <span
                  key={idx}
                  className="bg-white/90 border border-sky-300 text-sky-900 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <span className="text-amber-500 font-bold">✓</span>
                  <span>{concept}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3. LET'S LEARN TOGETHER (Requirement #3 Step 4: Guided Learning) */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤝</span>
              <h3 className="font-display-hero text-xl font-bold text-slate-900">
                Let's Learn Together
              </h3>
            </div>
            <span className="text-xs font-bold bg-amber-200 text-amber-950 px-3 py-1 rounded-full">
              Teach First, Answer Last
            </span>
          </div>

          {/* Progressive Hints Accordion */}
          <div className="bg-amber-50/80 border-2 border-amber-300 rounded-3xl p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center gap-2 text-amber-900 font-display-hero text-sm font-bold">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Need a Hint? Click below to peek without spoiling the answer!</span>
            </div>

            <div className="flex flex-col gap-2">
              {hintsList.map((hint, idx) => {
                const isRevealed = revealedHints[idx];
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-xs"
                  >
                    <div
                      onClick={() => toggleHint(idx)}
                      className="p-3.5 flex items-center justify-between cursor-pointer select-none hover:bg-amber-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-xs sm:text-sm text-slate-800">
                          {isRevealed ? `Hint #${idx + 1}` : `Click to Reveal Hint #${idx + 1} 💡`}
                        </span>
                      </div>
                      <span className="text-xs text-amber-700 font-bold">
                        {isRevealed ? "Hide" : "Show"}
                      </span>
                    </div>

                    {isRevealed && (
                      <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed border-t border-amber-100 animate-fadeIn">
                        {hint}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual Examples Card */}
          {visualExamplesList.map((ex, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#E8DFD1] shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                <span className="text-base">🎨</span>
                <span>Visual Diagram / Analogy: {ex.title}</span>
              </div>
              <pre className="font-mono text-xs sm:text-sm bg-slate-50 p-4 rounded-2xl border border-slate-200 text-slate-800 whitespace-pre-wrap leading-relaxed font-bold">
                {ex.diagram}
              </pre>
            </div>
          ))}

          {/* Step-by-Step Learning Breakdown */}
          <div className="flex flex-col gap-3">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-600 px-1">
              Step-by-Step Explanation ({childExplanation.steps?.length || 3} Steps)
            </div>

            {childExplanation.steps?.map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-7 shadow-md border-2 border-[#E8DFD1] hover:border-sky-300 transition-all"
              >
                <div className="flex items-start gap-3.5 mb-2">
                  <div className="w-9 h-9 rounded-2xl bg-sky-500 text-white font-display-hero text-base font-bold flex items-center justify-center flex-shrink-0 shadow-sm">
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
                  <div className="mt-4 bg-amber-50/70 border border-amber-200 rounded-2xl p-3 text-xs font-bold font-mono text-amber-900 flex items-center gap-2">
                    <span className="text-base">💡</span>
                    <span>{step.visualTip}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 4. MINI QUIZ (Verify Understanding before unlock) */}
        <div className="bg-purple-50/90 border-2 border-purple-300 rounded-3xl p-6 sm:p-7 shadow-md flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧠</span>
              <div>
                <h3 className="font-display-hero text-base sm:text-lg font-bold text-purple-950">
                  Mini Quiz: Check Your Understanding!
                </h3>
                <p className="text-xs text-purple-800">
                  Answer this question to make sure you've mastered the concept before requesting the final solution.
                </p>
              </div>
            </div>
            <span className="bg-purple-200 text-purple-900 text-xs font-extrabold px-3 py-1 rounded-full">
              +3 Stars ⭐
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-purple-200 shadow-xs font-display-hero text-sm sm:text-base font-bold text-slate-900">
            {miniQuiz.question}
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-2.5">
            {miniQuiz.options.map((opt, idx) => {
              const isSelected = quizAnsweredIndex === idx;
              const isCorrect = idx === miniQuiz.correctIndex;
              let btnClass = "bg-white hover:bg-purple-100/50 text-slate-800 border-2 border-purple-200";

              if (quizSubmitted) {
                if (isCorrect) {
                  btnClass = "bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-bold";
                } else if (isSelected && !isCorrect) {
                  btnClass = "bg-rose-100 border-2 border-rose-400 text-rose-950 font-bold";
                } else {
                  btnClass = "bg-white/60 border border-slate-200 text-slate-400";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleQuizSelect(idx)}
                  disabled={quizSubmitted}
                  className={`p-3.5 rounded-2xl text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${btnClass}`}
                >
                  <span>{opt}</span>
                  {quizSubmitted && isCorrect && <Check className="w-5 h-5 text-emerald-700" />}
                  {quizSubmitted && isSelected && !isCorrect && <X className="w-5 h-5 text-rose-600" />}
                </button>
              );
            })}
          </div>

          {quizSubmitted && (
            <div className="p-3.5 bg-white rounded-2xl border border-purple-200 text-xs text-purple-900 leading-relaxed animate-fadeIn">
              <strong>Explanation:</strong> {miniQuiz.explanation}
            </div>
          )}
        </div>

        {/* 5. "I UNDERSTAND" CELEBRATION BUTTON */}
        <div className="bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-md text-center flex flex-col items-center gap-3">
          <div className="text-3xl">🌟</div>
          <h3 className="font-display-hero text-xl font-bold text-slate-900">
            Did you walk through all the steps?
          </h3>
          <p className="text-xs text-slate-600 max-w-md">
            Clicking "I Understand" celebrates your learning with stars and unlocks the Parent PIN gate to see the complete solution!
          </p>

          <button
            onClick={handleIUnderstand}
            disabled={hasUnderstood}
            className={`px-8 py-4 rounded-2xl font-display-hero text-base font-extrabold shadow-md transition-all active:scale-95 flex items-center gap-2.5 ${
              hasUnderstood
                ? "bg-emerald-500 text-white cursor-default"
                : "bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-[0_5px_0_0_#b45309] active:shadow-none active:translate-y-[4px]"
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{hasUnderstood ? "Awesome! I Understand ✓ (+5 Stars)" : "I Understand! ⭐ (+5 Stars)"}</span>
          </button>
        </div>

        {/* 6. PARENT PIN PROTECTION GATE (Requirement #3 Step 5 & Requirement #4) */}
        <div
          id="parent-pin-section"
          className={`rounded-3xl p-6 sm:p-7 shadow-md border-2 transition-all ${
            answerUnlocked
              ? "bg-emerald-50 border-emerald-300"
              : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300"
          }`}
        >
          {answerUnlocked ? (
            /* UNLOCKED: FINAL SOLUTIONS DISPLAY */
            <div className="flex flex-col gap-5 animate-scaleUp">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-display-hero text-xl font-bold text-emerald-950">
                      Verified Final Answers & Solutions
                    </h3>
                    <p className="text-xs text-emerald-800">
                      Parent PIN verified. Compare your work against the complete worked solution!
                    </p>
                  </div>
                </div>
                <span className="bg-emerald-200 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full">
                  PIN Unlocked
                </span>
              </div>

              {/* Answers Grid */}
              <div className="flex flex-col gap-3">
                {childExplanation.finalAnswers?.map((ans, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <span className="font-display-hero text-sm font-bold text-slate-900">{ans.question}</span>
                      <p className="text-xs text-slate-500 mt-0.5">{ans.checkExplanation}</p>
                    </div>

                    <div className="px-4 py-2 bg-emerald-100 text-emerald-900 rounded-xl font-mono text-base font-extrabold text-center sm:text-right border border-emerald-300">
                      {ans.answer}
                    </div>
                  </div>
                ))}
              </div>

              {/* Encouraging Mascot Tip */}
              <div className="p-4 bg-white/80 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2.5">
                <span className="text-2xl">🎉</span>
                <span className="font-bold">{childExplanation.encouragingTip || "Incredible work today! You didn't just copy an answer — you truly understood it!"}</span>
              </div>
            </div>
          ) : (
            /* LOCKED: PARENT PIN GATE */
            <div className="flex flex-col items-center text-center gap-4 py-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md">
                <Lock className="w-7 h-7" />
              </div>

              <div>
                <h3 className="font-display-hero text-xl sm:text-2xl font-extrabold text-slate-900">
                  Final Answer is Protected by Parent PIN
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mt-1 leading-relaxed">
                  "This helps ensure learning happens before viewing the complete solution."
                </p>
                <p className="text-xs text-amber-900 font-bold mt-1">
                  Ask your parent or guardian to enter their 4-digit PIN below to reveal the verified answer.
                </p>
              </div>

              <form onSubmit={handlePinSubmit} className="flex flex-col items-center gap-3 w-full max-w-xs">
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="Enter 4-digit PIN"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-center tracking-[8px] font-mono font-extrabold text-xl px-4 py-3 bg-white border-2 border-amber-300 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-md transition-all active:scale-95"
                  >
                    Unlock
                  </button>
                </div>

                {pinError && (
                  <p className="text-xs font-bold text-rose-600 animate-shake">
                    {pinError}
                  </p>
                )}

                <div className="text-[11px] text-slate-500 font-medium">
                  Default Demo PIN: <strong className="font-mono text-slate-800">1234</strong>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Modal: Zoom Worksheet Image */}
        {viewingImage && (
          <div
            onClick={() => setViewingImage(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="relative max-w-3xl max-h-[90vh] bg-white rounded-3xl p-3 overflow-hidden shadow-2xl">
              <img
                src={viewingImage}
                alt="Original worksheet"
                className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
              />
              <button
                onClick={() => setViewingImage(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/60 text-white font-bold flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ExplanationView;
