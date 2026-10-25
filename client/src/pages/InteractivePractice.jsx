import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ArrowLeft, CheckCircle2, XCircle, Lightbulb, Trophy, RotateCcw, Volume2, VolumeX, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export function InteractivePractice() {
  const { activeSession, setCurrentView, showToast, speakText, stopSpeaking, isSpeaking, selectedChild, setChildrenList } = useApp();

  // Dynamic question fallback by subject if session doesn't have custom options
  const defaultMathQuestions = [
    {
      id: 1,
      problem: "34 + 28 = ?",
      hint: "Add 4 + 8 first in the ones place (12). Write 2, carry 1 ten to 3 + 2!",
      correctAnswer: "62",
      options: ["52", "62", "64", "58"]
    },
    {
      id: 2,
      problem: "56 + 19 = ?",
      hint: "Add 6 + 9 in the ones column (15). Then add 1 + 5 + 1 tens!",
      correctAnswer: "75",
      options: ["65", "74", "75", "85"]
    },
    {
      id: 3,
      problem: "47 + 36 = ?",
      hint: "7 + 6 = 13. Remember to add that carried 1 to 4 + 3 tens!",
      correctAnswer: "83",
      options: ["73", "81", "83", "93"]
    }
  ];

  const defaultScienceQuestions = [
    {
      id: 1,
      problem: "Which organelle is the 'powerhouse' that produces cellular ATP energy?",
      hint: "Both plant and animal cells rely on this organelle to burn glucose for energy.",
      correctAnswer: "Mitochondria",
      options: ["Chloroplast", "Mitochondria", "Ribosome", "Vacuole"]
    },
    {
      id: 2,
      problem: "What rigid structure surrounds plant cells, but is NOT present in animal cells?",
      hint: "It is made of tough cellulose fibers that keep plant stems upright.",
      correctAnswer: "Cell Wall",
      options: ["Cell Wall", "Cell Membrane", "Cytoplasm", "Nucleus"]
    },
    {
      id: 3,
      problem: "Where is the genetic blueprint (DNA) housed inside eukaryotic cells?",
      hint: "Think of this as the main control center or command tower.",
      correctAnswer: "Nucleus",
      options: ["Nucleus", "Ribosome", "Lysosome", "Chloroplast"]
    }
  ];

  const defaultReadingQuestions = [
    {
      id: 1,
      problem: "What is the 'main idea' of an informational passage?",
      hint: "It's the primary overarching point the author wants the reader to understand.",
      correctAnswer: "The central message supported by key facts",
      options: [
        "The central message supported by key facts",
        "A minor trivia detail in paragraph 2",
        "The date the author wrote the article",
        "The caption under a small photo"
      ]
    },
    {
      id: 2,
      problem: "How do supporting details connect to the main idea?",
      hint: "Details provide evidence, proof, and illustrations of the big idea.",
      correctAnswer: "They supply proof and examples for the main idea",
      options: [
        "They supply proof and examples for the main idea",
        "They contradict the author's primary theme",
        "They are filler text without relevance",
        "They introduce an entirely unrelated topic"
      ]
    },
    {
      id: 3,
      problem: "In an article about honeybee colonies, what detail shows worker cooperation?",
      hint: "Think of the waggle dance and pollen gathering routines.",
      correctAnswer: "Bees communicate flower locations using waggle dances",
      options: [
        "Bees communicate flower locations using waggle dances",
        "Bears like to steal honey in winter",
        "Bees hibernate individually in the soil",
        "Flowers only bloom on sunny afternoons"
      ]
    }
  ];

  const defaultSocialStudiesQuestions = [
    {
      id: 1,
      problem: "Which branch of the US government writes and votes on federal laws?",
      hint: "It meets in the US Capitol building and includes both the Senate and the House of Representatives.",
      correctAnswer: "The Legislative Branch (Congress)",
      options: [
        "The Legislative Branch (Congress)",
        "The Executive Branch (The President)",
        "The Judicial Branch (The Supreme Court)",
        "The National Archives"
      ]
    },
    {
      id: 2,
      problem: "What is the primary function of a map's compass rose?",
      hint: "It shows cardinal directions: North, South, East, and West.",
      correctAnswer: "To indicate cardinal directions (N, S, E, W)",
      options: [
        "To indicate cardinal directions (N, S, E, W)",
        "To calculate elevation of mountains",
        "To decode the map legend symbols",
        "To measure driving distances"
      ]
    },
    {
      id: 3,
      problem: "Why did the US Constitution establish a system of Checks and Balances?",
      hint: "It ensures powers are balanced so no single branch can act without accountability.",
      correctAnswer: "To prevent any single branch from becoming too powerful",
      options: [
        "To prevent any single branch from becoming too powerful",
        "To speed up voting on weekly taxes",
        "To eliminate elections for state senators",
        "To allow only one political party"
      ]
    }
  ];

  const defaultLanguagesQuestions = [
    {
      id: 1,
      problem: "In Spanish, how do you politely greet someone in the morning?",
      hint: "It literally means 'Good days!'",
      correctAnswer: "¡Buenos días!",
      options: ["¡Buenos días!", "¡Buenas noches!", "¡Hasta luego!", "¡De nada!"]
    },
    {
      id: 2,
      problem: "Which pronoun in French means 'we'?",
      hint: "It begins with the letter 'N'.",
      correctAnswer: "Nous",
      options: ["Nous", "Vous", "Ils", "Elles"]
    },
    {
      id: 3,
      problem: "What is the English meaning of the Spanish cognate 'Excelente'?",
      hint: "Cognates look and sound very similar across related languages!",
      correctAnswer: "Excellent",
      options: ["Excellent", "Exciting", "Exhausted", "Expensive"]
    }
  ];

  const [subjectFilter, setSubjectFilter] = useState("auto");

  // Resolve questions based on selected subject filter or active session
  const questions = React.useMemo(() => {
    if (subjectFilter === "math") return defaultMathQuestions;
    if (subjectFilter === "science") return defaultScienceQuestions;
    if (subjectFilter === "reading") return defaultReadingQuestions;
    if (subjectFilter === "social") return defaultSocialStudiesQuestions;
    if (subjectFilter === "languages") return defaultLanguagesQuestions;

    if (activeSession?.practiceQuestions && activeSession.practiceQuestions.length > 0 && activeSession.practiceQuestions[0].options) {
      return activeSession.practiceQuestions;
    }
    const subj = activeSession?.subject?.toLowerCase() || "math";
    if (subj.includes("sci")) return defaultScienceQuestions;
    if (subj.includes("read") || subj.includes("ela") || subj.includes("write")) return defaultReadingQuestions;
    if (subj.includes("soc") || subj.includes("civ")) return defaultSocialStudiesQuestions;
    if (subj.includes("lang") || subj.includes("span")) return defaultLanguagesQuestions;
    return defaultMathQuestions;
  }, [subjectFilter, activeSession]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleSubjectChange = (newSubj) => {
    setSubjectFilter(newSubj);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);
    setScore(0);
    setCompleted(false);
  };

  const currentQ = questions[currentIndex] || questions[0];

  const handleReadQuestion = () => {
    if (!currentQ) return;
    const text = `Question ${currentIndex + 1}: ${currentQ.problem}. Here are your choices: ${currentQ.options.join(", ")}.`;
    speakText(text);
  };

  const handleSelectOption = (opt) => {
    if (isAnswered) return;
    setSelectedOption(opt);
  };

  const handleCheck = () => {
    if (!selectedOption) return;
    setIsAnswered(true);
    const correct = selectedOption === currentQ.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(s => s + 1);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      showToast("Correct! Awesome job! 🎉");
    } else {
      showToast("Not quite, check the hint and try again!", "error");
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setShowHint(false);
    } else {
      setCompleted(true);
      if (selectedChild) {
        setChildrenList((prev) =>
          prev.map((c) =>
            c.id === selectedChild.id
              ? { ...c, weeklySessions: (c.weeklySessions || 0) + 1, streak: (c.streak || 0) + 1 }
              : c
          )
        );
      }
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
      showToast("Practice round completed! +1 added to your weekly streak! 🔥");
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);
    setScore(0);
    setCompleted(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#FFF8EC] text-[#33302A] py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto flex flex-col gap-6">
        
        {/* Top bar */}
        <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-amber-200">
          <button
            onClick={() => setCurrentView("explanation")}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-amber-100 hover:bg-amber-200 px-3.5 py-2 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explanation</span>
          </button>

          <span className="font-display-hero text-sm font-bold text-amber-900">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        {/* Subject Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-amber-200 text-xs font-bold shadow-xs">
          {[
            { id: "auto", label: "Session Topic 🎯" },
            { id: "math", label: "Math ➕" },
            { id: "science", label: "Science 🔬" },
            { id: "reading", label: "Reading 📖" },
            { id: "social", label: "Social Studies 🌍" },
            { id: "languages", label: "Languages 🗣️" }
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => handleSubjectChange(s.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                subjectFilter === s.id
                  ? "bg-primary-container text-white shadow-sm font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-amber-50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Question Card */}
        {!completed ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#E8DFD1] flex flex-col gap-6">
            
            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-primary-container h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{activeSession?.subject || "Practice"} • Question {currentIndex + 1}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleReadQuestion}
                  className="flex items-center gap-1.5 text-xs font-bold bg-sky-50 hover:bg-sky-100 text-sky-700 px-3 py-1 rounded-full transition-colors"
                  title="Read question out loud"
                >
                  <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                  <span>Listen</span>
                </button>
                <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                  Score: {score}
                </span>
              </div>
            </div>

            <div className="text-center py-4">
              <h2 className="font-display-hero text-2xl sm:text-3xl font-extrabold text-parent-ink tracking-wide leading-snug">
                {currentQ.problem}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOption === opt;
                const isLong = opt.length > 8;
                let btnStyle = "bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 text-slate-800";
                
                if (isSelected) {
                  btnStyle = "bg-sky-500 text-white border-sky-600 shadow-md scale-102";
                }
                if (isAnswered) {
                  if (opt === currentQ.correctAnswer) {
                    btnStyle = "bg-emerald-500 text-white border-emerald-600 shadow-md";
                  } else if (isSelected && !isCorrect) {
                    btnStyle = "bg-rose-500 text-white border-rose-600";
                  }
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectOption(opt)}
                    className={`rounded-2xl transition-all ${
                      isLong
                        ? "py-3.5 px-4 font-body-kid-md text-sm sm:text-base font-bold text-left flex items-center justify-between"
                        : "py-5 font-display-hero text-2xl font-bold text-center justify-center flex items-center"
                    } ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && opt === currentQ.correctAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0 ml-2" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-white flex-shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Hint Box */}
            {showHint && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs font-medium text-amber-900 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p>{currentQ.hint}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-2">
              {!isAnswered ? (
                <>
                  <button
                    onClick={() => setShowHint(true)}
                    className="w-1/3 py-4 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-display-hero text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Lightbulb className="w-4 h-4" />
                    <span>Need a Hint?</span>
                  </button>

                  <button
                    onClick={handleCheck}
                    disabled={!selectedOption}
                    className={`w-2/3 py-4 rounded-2xl font-display-hero text-base font-bold transition-all ${
                      selectedOption
                        ? "bg-primary-container hover:bg-sky-500 text-white shadow-[0_4px_0_0_#004c69]"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    Check Answer
                  </button>
                </>
              ) : (
                <button
                  onClick={handleNext}
                  className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-display-hero text-lg font-bold shadow-[0_4px_0_0_#2a7c58] transition-all"
                >
                  {currentIndex < questions.length - 1 ? "Next Question →" : "See Final Score 🏆"}
                </button>
              )}
            </div>

          </div>
        ) : (
          /* Completion Trophy Card */
          <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-[#E8DFD1] text-center flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-4xl shadow-md animate-bounce">
              🏆
            </div>

            <h3 className="font-display-hero text-3xl font-extrabold text-parent-ink">
              Practice Complete!
            </h3>
            <p className="text-slate-600 text-sm">
              You scored <strong>{score} out of {questions.length}</strong> correct!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
              <button
                onClick={handleRestart}
                className="w-full py-3.5 rounded-2xl border-2 border-slate-300 font-bold text-slate-800 hover:bg-slate-50 transition-all text-sm flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
              <button
                onClick={() => setCurrentView("explanation")}
                className="w-full py-3.5 rounded-2xl bg-primary-container text-white font-bold hover:bg-sky-500 transition-all text-sm"
              >
                Back to Explanation
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
