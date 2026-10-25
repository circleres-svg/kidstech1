import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { ArrowLeft, Printer, Eye, EyeOff, CheckCircle, RotateCcw } from "lucide-react";

export function WorksheetGenerator() {
  const { setCurrentView, selectedChild, activeSession } = useApp();
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [worksheetSubject, setWorksheetSubject] = useState(
    activeSession?.subject || "Math"
  );
  const [studentName, setStudentName] = useState(selectedChild?.name || "Emma");
  const [mathSeed, setMathSeed] = useState(1);
  const [difficulty, setDifficulty] = useState("Standard"); // Foundational | Standard | Challenge
  const [selectedTopic, setSelectedTopic] = useState("auto");

  // Topics per subject
  const topicCatalog = {
    Math: [
      { id: "regroup-add", title: "Two-Digit Addition with Regrouping (Roof Boxes)", standard: "CCSS.MATH.3.NBT.A.2" },
      { id: "regroup-sub", title: "Multi-Digit Subtraction with Regrouping (Borrowing)", standard: "CCSS.MATH.3.NBT.A.2" },
      { id: "multiplication", title: "Equal Groups & Multiplication Arrays", standard: "CCSS.MATH.3.OA.A.1" },
      { id: "fractions", title: "Visual Unit Fractions & Number Line Halves", standard: "CCSS.MATH.3.NF.A.2" }
    ],
    Science: [
      { id: "cell-biology", title: "Cellular Organelles & Structure (Plant vs Animal)", standard: "NGSS.MS-LS1-2" },
      { id: "solar-system", title: "Solar System: Planetary Orbits & Gravity", standard: "NGSS.MS-ESS1-3" },
      { id: "water-cycle", title: "Water Cycle: Evaporation, Condensation & Precipitation", standard: "NGSS.4-ESS2-1" }
    ],
    "Reading-Writing": [
      { id: "honeybees", title: "Main Idea & Text Clues: 'The Secret Language of Honeybees'", standard: "CCSS.ELA-LITERACY.RI.3.2" },
      { id: "butterflies", title: "Informational Comprehension: 'Monarch Butterfly Migration'", standard: "CCSS.ELA-LITERACY.RI.4.1" },
      { id: "creative-narrative", title: "Narrative Dialogue & Descriptive Adjectives Prompt", standard: "CCSS.ELA-LITERACY.W.3.3" }
    ],
    "Social Studies": [
      { id: "gov-branches", title: "The Three Branches of US Government (Checks & Balances)", standard: "C3.D2.Civ.1.3-5" },
      { id: "map-skills", title: "Geography & Map Skills: Continents, Oceans & Coordinates", standard: "C3.D2.Geo.1.3-5" }
    ]
  };

  const currentTopics = topicCatalog[worksheetSubject] || topicCatalog.Math;
  const activeTopicObj = currentTopics.find(t => t.id === selectedTopic) || currentTopics[0];

  // Dynamic Math Problems Generator
  const mathProblems = useMemo(() => {
    const isSub = selectedTopic === "regroup-sub";
    const isMult = selectedTopic === "multiplication";

    if (isMult) {
      const baseFactors = [
        { num: 1, top: 4, bottom: 6, ans: 24, tip: "4 rows of 6 dots" },
        { num: 2, top: 7, bottom: 3, ans: 21, tip: "7 groups of 3" },
        { num: 3, top: 8, bottom: 5, ans: 40, tip: "8 rows of 5" },
        { num: 4, top: 6, bottom: 6, ans: 36, tip: "6 squared" },
        { num: 5, top: 9, bottom: 4, ans: 36, tip: "9 groups of 4" },
        { num: 6, top: 8, bottom: 7, ans: 56, tip: "8 times 7" }
      ];
      if (mathSeed > 1) {
        return baseFactors.map((p, idx) => {
          const t = ((p.top + mathSeed + idx) % 8) + 2;
          const b = ((p.bottom + mathSeed) % 9) + 2;
          return { num: p.num, top: t, bottom: b, ans: t * b, symbol: "×" };
        });
      }
      return baseFactors.map(p => ({ ...p, symbol: "×" }));
    }

    if (isSub) {
      const baseSub = [
        { num: 1, top: 62, bottom: 28, ans: 34 },
        { num: 2, top: 75, bottom: 39, ans: 36 },
        { num: 3, top: 83, bottom: 47, ans: 36 },
        { num: 4, top: 91, bottom: 45, ans: 46 },
        { num: 5, top: 84, bottom: 29, ans: 55 },
        { num: 6, top: 95, bottom: 58, ans: 37 }
      ];
      if (mathSeed > 1) {
        return baseSub.map((p, idx) => {
          const topVal = 70 + (mathSeed * 3 + idx) % 25;
          const botVal = 25 + (mathSeed * 2 + idx) % 20;
          return { num: p.num, top: topVal, bottom: botVal, ans: topVal - botVal, symbol: "−" };
        });
      }
      return baseSub.map(p => ({ ...p, symbol: "−" }));
    }

    // Default Addition with regrouping
    const baseAdd = [
      { num: 1, top: 28, bottom: 19, ans: 47 },
      { num: 2, top: 45, bottom: 37, ans: 82 },
      { num: 3, top: 36, bottom: 25, ans: 61 },
      { num: 4, top: 54, bottom: 28, ans: 82 },
      { num: 5, top: 67, bottom: 18, ans: 85 },
      { num: 6, top: 49, bottom: 34, ans: 83 }
    ];
    if (mathSeed > 1) {
      return [
        { num: 1, top: 35 + (mathSeed % 10), bottom: 28, ans: 35 + (mathSeed % 10) + 28, symbol: "+" },
        { num: 2, top: 57, bottom: 19 + (mathSeed % 7), ans: 57 + 19 + (mathSeed % 7), symbol: "+" },
        { num: 3, top: 48, bottom: 36, ans: 84, symbol: "+" },
        { num: 4, top: 63, bottom: 29, ans: 92, symbol: "+" },
        { num: 5, top: 76, bottom: 17, ans: 93, symbol: "+" },
        { num: 6, top: 38, bottom: 45, ans: 83, symbol: "+" }
      ];
    }
    return baseAdd.map(p => ({ ...p, symbol: "+" }));
  }, [mathSeed, selectedTopic]);

  // Science Questions Catalog
  const scienceCatalog = {
    "cell-biology": [
      { num: 1, question: "Which organelle is considered the 'powerhouse of the cell' and why?", lines: 3, answer: "Mitochondria. It produces cellular energy (ATP) through cellular respiration." },
      { num: 2, question: "Explain the difference between a plant Cell Wall and a flexible Cell Membrane.", lines: 3, answer: "The cell wall is a rigid outer layer made of cellulose found ONLY in plant cells. The cell membrane is flexible and found in both plant and animal cells." },
      { num: 3, question: "Why do plant cells require Chloroplasts while animal cells do not?", lines: 3, answer: "Plants are autotrophs that make their own food through photosynthesis using sunlight in chloroplasts. Animals eat other organisms for energy." }
    ],
    "solar-system": [
      { num: 1, question: "What fundamental force keeps planets in orbit around the Sun rather than flying off into deep space?", lines: 3, answer: "The Sun's immense gravitational pull continuously pulls planets toward it while their forward momentum keeps them in orbital balance." },
      { num: 2, question: "Describe why inner terrestrial planets (Mercury, Venus, Earth, Mars) differ in composition from outer gas giants.", lines: 3, answer: "Inner planets formed in hotter regions near the Sun where rocky metals could condense, while gas and ice giants formed in cooler regions capturing hydrogen and helium." },
      { num: 3, question: "How does the distance of a planet from the Sun affect the length of its planetary year?", lines: 3, answer: "Planets farther from the Sun have larger orbital paths and travel at slower orbital velocities, making their years significantly longer." }
    ],
    "water-cycle": [
      { num: 1, question: "Explain the difference between Evaporation and Transpiration in the hydrologic cycle.", lines: 3, answer: "Evaporation is the solar warming of open water into water vapor; Transpiration is the release of water vapor through microscopic plant leaf pores (stomata)." },
      { num: 2, question: "Under what atmospheric conditions does Condensation occur to form clouds in the troposphere?", lines: 3, answer: "As warm moist air rises, it cools to its dew point temperature and condenses onto tiny airborne particles (cloud condensation nuclei)." },
      { num: 3, question: "What is groundwater infiltration and why is it vital for natural freshwater ecosystems?", lines: 3, answer: "Infiltration is precipitation soaking down through soil and rock layers into underground aquifers, naturally filtering drinking water." }
    ]
  };

  // Reading Passages Catalog
  const readingCatalog = {
    honeybees: {
      title: "Reading Passage: The Secret Language of Honeybees",
      text: "Inside a bustling honeybee hive, thousands of worker bees live in harmony. When a scout bee discovers a rich field of wildflowers, she returns to the hive to share the news. In the darkness of the colony, she performs an intricate dance called the 'waggle dance.' By vibrating her abdomen and moving in figure-eights, she communicates the exact sun angle and distance of the nectar. Together, the hive functions as a single super-organism where communication is essential for survival.",
      questions: [
        { num: 1, question: "What is the primary main idea of this passage about the honeybee colony?", lines: 3, answer: "Honeybees communicate through specialized dances to coordinate food gathering and ensure colony survival." },
        { num: 2, question: "Quote one piece of text evidence showing how bees share coordinates without vision.", lines: 3, answer: "Scout bees perform the 'waggle dance' by vibrating their abdomens in figure-eights to signal the sun angle and distance." },
        { num: 3, question: "How would the colony be affected if the scout bees were unable to communicate?", lines: 3, answer: "Worker bees would not know where nectar fields are located, leading to food shortages and hive collapse." }
      ]
    },
    butterflies: {
      title: "Reading Passage: The Great Journey of the Monarch Butterfly",
      text: "Every autumn, millions of monarch butterflies embark on an incredible journey spanning over 2,500 miles from Canada and the northern United States down to the mountain forests of central Mexico. Despite weighing less than a paperclip, monarchs navigate using an internal sun compass and magnetic sensors. Remarkably, the butterflies making this journey have never been to Mexico before; the migration instinct is passed down through genetic inheritance across generations.",
      questions: [
        { num: 1, question: "What is the central purpose and destination of the monarch butterfly migration?", lines: 3, answer: "Monarchs travel over 2,500 miles south to warmer mountain forests in central Mexico to survive harsh northern winters." },
        { num: 2, question: "According to the text, how do monarchs navigate to places they have never visited?", lines: 3, answer: "They use an internal sun compass, magnetic sensors, and genetically inherited instincts." },
        { num: 3, question: "What detail from the text demonstrates the physical resilience of the butterfly?", lines: 3, answer: "Weighing less than a paperclip, they fly over 2,500 miles across the continent." }
      ]
    },
    "creative-narrative": {
      title: "Creative Writing Prompt: The Mystery of the Clockwork Owl",
      text: "Prompt: You are exploring the dusty attic of your grandparents' house when you discover an ornate wooden box. Inside sits a brass mechanical owl with emerald eyes. When you turn the winding key, it clicks, blinks its mechanical wings, and whispers your name...",
      questions: [
        { num: 1, question: "Write the beginning of your story: Describe the attic setting using three vivid sensory details (sound, smell, touch).", lines: 4, answer: "Rubric: Rich descriptions of dust motes, creaking floorboards, and the cool metallic feel of the brass key." },
        { num: 2, question: "Add dialogue: Write a conversation between you and the clockwork owl with proper quotation marks and punctuation.", lines: 4, answer: "Rubric: Proper capitalization, comma placement inside quotes, and distinct character voices." }
      ]
    }
  };

  // Social Studies Questions
  const socialStudiesCatalog = {
    "gov-branches": [
      { num: 1, question: "Identify the three branches of the US government and name the leader or body of each.", lines: 3, answer: "1. Legislative (Congress: Senate & House of Representatives), 2. Executive (The President), 3. Judicial (The Supreme Court)." },
      { num: 2, question: "Explain the constitutional principle of 'Checks and Balances' and provide one real example.", lines: 3, answer: "Checks and Balances prevents any single branch from becoming too powerful. Example: The President can veto a law passed by Congress, but Congress can override the veto with a 2/3 vote." },
      { num: 3, question: "What is the primary responsibility of the Supreme Court and Judicial Branch?", lines: 3, answer: "The Supreme Court interprets the laws and determines whether they comply with the US Constitution (Judicial Review)." }
    ],
    "map-skills": [
      { num: 1, question: "What is the purpose of a map legend or key?", lines: 2, answer: "A map key explains what symbols, colors, and line styles represent on the map." },
      { num: 2, question: "Explain the difference between Latitude lines (parallels) and Longitude lines (meridians).", lines: 3, answer: "Latitude lines measure North-South distance from the Equator (0°); Longitude lines measure East-West distance from the Prime Meridian (0°)." },
      { num: 3, question: "Name the seven continents of the Earth in order from largest to smallest by land area.", lines: 3, answer: "Asia, Africa, North America, South America, Antarctica, Europe, Australia." }
    ]
  };

  const currentScienceList = scienceCatalog[selectedTopic] || scienceCatalog["cell-biology"];
  const currentReadingObj = readingCatalog[selectedTopic] || readingCatalog.honeybees;
  const currentSocialList = socialStudiesCatalog[selectedTopic] || socialStudiesCatalog["gov-branches"];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 text-slate-900 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        
        {/* Print Toolbar (Hidden on print) */}
        <div className="no-print flex flex-col gap-4 bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => setCurrentView("explanation")}
              className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-all self-start sm:self-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Explanation</span>
            </button>

            {/* Subject Switcher */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
              {["Math", "Science", "Reading-Writing", "Social Studies"].map((subj) => {
                const isActive = worksheetSubject.toLowerCase().includes(subj.toLowerCase().slice(0, 4));
                return (
                  <button
                    key={subj}
                    onClick={() => {
                      setWorksheetSubject(subj);
                      setSelectedTopic("auto");
                    }}
                    className={`px-3.5 py-1.5 rounded-xl transition-all ${
                      isActive
                        ? "bg-primary text-white shadow-sm font-extrabold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {subj}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAnswerKey(!showAnswerKey)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl"
                title="Toggle Teacher / Parent Answer Key"
              >
                {showAnswerKey ? <EyeOff className="w-4 h-4 text-emerald-600" /> : <Eye className="w-4 h-4" />}
                <span className="hidden sm:inline">{showAnswerKey ? "Hide Answer Key" : "Show Answer Key"}</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-sky-800 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Print PDF</span>
              </button>
            </div>
          </div>

          {/* Sub-toolbar: Topic & Difficulty Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">Topic:</span>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 font-bold text-slate-800 focus:outline-none focus:border-primary text-xs w-full sm:w-auto"
              >
                {currentTopics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              {worksheetSubject.toLowerCase().includes("math") && (
                <button
                  onClick={() => setMathSeed((s) => s + 1)}
                  className="flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded-xl transition-colors"
                  title="Generate new randomized problem numbers"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Regenerate Numbers</span>
                </button>
              )}

              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-400 text-[11px]">Difficulty:</span>
                <div className="inline-flex bg-slate-100 rounded-lg p-0.5 text-[11px] font-bold">
                  {["Foundational", "Standard", "Challenge"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        difficulty === d ? "bg-white text-parent-ink shadow-xs" : "text-slate-500"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Printable Paper Document */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-300 print:shadow-none print:border-none print:p-0 print:m-0">
          
          {/* Header */}
          <div className="border-b-2 border-slate-800 pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🎒</span>
                <h1 className="font-display-hero text-2xl font-bold text-slate-900">
                  KIDSTECH Academic Practice Worksheet
                </h1>
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-1">
                {activeTopicObj?.title} • Standard: {activeTopicObj?.standard} • {difficulty} Level
              </p>
            </div>

            <div className="flex flex-col gap-2 text-xs text-slate-700 font-medium w-full sm:w-auto">
              <div className="flex gap-2 items-center">
                <span>Student:</span>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="border-b border-slate-400 min-w-[140px] font-bold text-slate-900 bg-transparent focus:outline-none"
                />
              </div>
              <div className="flex gap-2 items-center">
                <span>Date:</span>
                <span className="border-b border-slate-400 min-w-[140px]">
                  {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>

          {/* ----------------- MATH WORKSHEET ----------------- */}
          {worksheetSubject.toLowerCase().includes("math") && (
            <>
              <div className="text-xs italic text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <strong>Instructions:</strong> Solve each problem neatly. For addition and subtraction, line up columns by place value and use the roof carry/borrow boxes when regrouping is needed.
              </div>

              {/* Problem Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 py-4">
                {mathProblems.map((p) => (
                  <div
                    key={p.num}
                    className="border border-slate-300 rounded-2xl p-5 flex flex-col items-center relative bg-white"
                  >
                    <span className="absolute top-2 left-3 text-xs font-bold text-slate-400">
                      #{p.num}
                    </span>

                    {/* Carry roof box */}
                    <div className="w-6 h-6 border border-dashed border-amber-400 rounded-md mb-2 flex items-center justify-center text-[10px] text-slate-300">
                      [ ]
                    </div>

                    {/* Stacked Vertical Problem */}
                    <div className="font-mono text-2xl font-bold text-slate-800 text-right pr-4">
                      <div className="tracking-widest">{p.top}</div>
                      <div className="border-b-2 border-slate-900 tracking-widest flex justify-end gap-3">
                        <span className="text-xl">{p.symbol || "+"}</span>
                        <span>{p.bottom}</span>
                      </div>
                      {/* Space for student answer */}
                      <div className="h-10 pt-2 text-emerald-700 font-bold">
                        {showAnswerKey ? p.ans : ""}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ----------------- SCIENCE WORKSHEET ----------------- */}
          {worksheetSubject.toLowerCase().includes("sci") && (
            <div className="flex flex-col gap-6">
              <div className="text-xs italic text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <strong>Instructions:</strong> Read each scientific question carefully. Write your answers in complete, evidence-based sentences using appropriate scientific vocabulary.
              </div>

              {/* Matching Box */}
              <div className="border border-slate-300 rounded-2xl p-4 bg-slate-50/50">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-2">
                  Part A: Scientific Key Vocabulary Matching
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-700">
                  <div>1. [ &nbsp;&nbsp; ] Cellular ATP Powerhouse</div>
                  <div className="text-slate-500 font-sans">A. Mitochondria</div>
                  <div>2. [ &nbsp;&nbsp; ] Solar Sugar Photosynthesis</div>
                  <div className="text-slate-500 font-sans">B. Chloroplast</div>
                  <div>3. [ &nbsp;&nbsp; ] Rigid Cellulose Outer Support</div>
                  <div className="text-slate-500 font-sans">C. Cell Wall</div>
                </div>
              </div>

              {/* Written Response Questions */}
              <div className="space-y-6 pt-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  Part B: Structured Inquiry Questions
                </h3>
                {currentScienceList.map((q) => (
                  <div key={q.num} className="border-b border-slate-200 pb-5">
                    <p className="text-sm font-bold text-slate-900 mb-3">
                      {q.num}. {q.question}
                    </p>
                    <div className="space-y-4">
                      {Array.from({ length: q.lines }).map((_, lIdx) => (
                        <div key={lIdx} className="border-b border-slate-300 h-6" />
                      ))}
                    </div>
                    {showAnswerKey && (
                      <div className="mt-2 text-xs text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                        <strong>Key:</strong> {q.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ----------------- READING & WRITING WORKSHEET ----------------- */}
          {worksheetSubject.toLowerCase().includes("read") && (
            <div className="flex flex-col gap-6">
              <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 text-xs text-slate-800 leading-relaxed">
                <h4 className="font-bold text-amber-950 uppercase tracking-wider mb-2">
                  {currentReadingObj.title}
                </h4>
                <p>{currentReadingObj.text}</p>
              </div>

              <div className="space-y-6 pt-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  Text Comprehension & Written Analysis
                </h3>
                {currentReadingObj.questions.map((q) => (
                  <div key={q.num} className="border-b border-slate-200 pb-5">
                    <p className="text-sm font-bold text-slate-900 mb-3">
                      {q.num}. {q.question}
                    </p>
                    <div className="space-y-4">
                      {Array.from({ length: q.lines }).map((_, lIdx) => (
                        <div key={lIdx} className="border-b border-slate-300 h-6" />
                      ))}
                    </div>
                    {showAnswerKey && (
                      <div className="mt-2 text-xs text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                        <strong>Key / Grading Rubric:</strong> {q.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ----------------- SOCIAL STUDIES WORKSHEET ----------------- */}
          {worksheetSubject.toLowerCase().includes("social") && (
            <div className="flex flex-col gap-6">
              <div className="text-xs italic text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <strong>Instructions:</strong> Demonstrate your civics and social studies understanding. Explain the roles, constitutional principles, and responsibilities accurately.
              </div>

              <div className="space-y-6 pt-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  Civic Concepts & Analytical Questions
                </h3>
                {currentSocialList.map((q) => (
                  <div key={q.num} className="border-b border-slate-200 pb-5">
                    <p className="text-sm font-bold text-slate-900 mb-3">
                      {q.num}. {q.question}
                    </p>
                    <div className="space-y-4">
                      {Array.from({ length: q.lines }).map((_, lIdx) => (
                        <div key={lIdx} className="border-b border-slate-300 h-6" />
                      ))}
                    </div>
                    {showAnswerKey && (
                      <div className="mt-2 text-xs text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                        <strong>Key:</strong> {q.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Answer Key Box at Bottom for Math */}
          {showAnswerKey && worksheetSubject.toLowerCase().includes("math") && (
            <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-300 bg-emerald-50/70 p-4 rounded-xl">
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 mb-2 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Teacher & Guardian Answer Key</span>
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs font-bold text-emerald-800">
                {mathProblems.map((p) => (
                  <div key={p.num} className="bg-white p-2 rounded border border-emerald-200 text-center">
                    #{p.num}: {p.ans}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 text-center text-[10px] text-slate-400">
            Generated by KIDSTECH Study Assistant Platform • COPPA Compliant • Common Core, NGSS & C3 Framework Aligned
          </div>

        </div>

      </div>
    </div>
  );
}
