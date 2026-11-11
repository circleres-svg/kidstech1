import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

const API_BASE =
  typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:5000/api"
    : "/api";

export const AVATAR_PRESETS = [
  { key: "bear", label: "Cozy Bear", emoji: "🐻", bg: "#ffdcbf" },
  { key: "fox", label: "Clever Fox", emoji: "🦊", bg: "#c4dcfe" },
  { key: "lion", label: "Brave Lion", emoji: "🦁", bg: "#ffdad6" },
  { key: "owl", label: "Wise Owl", emoji: "🦉", bg: "#dfe8ff" },
  { key: "koala", label: "Calm Koala", emoji: "🐨", bg: "#e8eeff" },
  { key: "panda", label: "Happy Panda", emoji: "🐼", bg: "#f1f3ff" },
  { key: "bunny", label: "Swift Bunny", emoji: "🐰", bg: "#ffdad6" },
  { key: "tiger", label: "Curious Tiger", emoji: "🐯", bg: "#ffdcbf" },
  { key: "penguin", label: "Smart Penguin", emoji: "🐧", bg: "#c4e7ff" },
  { key: "dolphin", label: "Playful Dolphin", emoji: "🐬", bg: "#7dd0ff" },
  { key: "robot", label: "Buddy Bot", emoji: "🤖", bg: "#d7e3ff" },
  { key: "astro", label: "Cosmo Pup", emoji: "🚀", bg: "#c4dcfe" },
  { key: "dino", label: "Little Rex", emoji: "🦖", bg: "#c8f2d5" },
  { key: "frog", label: "Hopper Frog", emoji: "🐸", bg: "#d2f8d2" },
  { key: "bee", label: "Busy Bee", emoji: "🐝", bg: "#fff2b2" },
  { key: "cat", label: "Curious Cat", emoji: "🐱", bg: "#ffd7ba" }
];

export function getChildEmoji(avatarKey) {
  if (!avatarKey) return "🎒";
  const found = AVATAR_PRESETS.find(a => a.key === avatarKey);
  return found ? found.emoji : "🌟";
}

const DEFAULT_CHILDREN = [
  {
    id: "child-1",
    parentId: "parent-sarah-101",
    name: "Emma",
    grade: 3,
    avatar: "bear",
    mascot: "Cozy Bear 🐻",
    track: "Quest Track",
    weeklySessions: 4,
    streak: 4,
    autonomyScore: 88,
    activeFocus: "Math: Two-digit addition with regrouping & tens blocks",
    accommodations: {
      dyslexiaFont: true,
      patienceMode: true,
      speechSpeed: "slow"
    },
    created_date: "2026-08-16T10:00:00Z"
  },
  {
    id: "child-2",
    parentId: "parent-sarah-101",
    name: "Noah",
    grade: 7,
    avatar: "fox",
    mascot: "Clever Fox 🦊",
    track: "Middle School STEM",
    weeklySessions: 2,
    streak: 2,
    autonomyScore: 74,
    activeFocus: "Science: Cell Organelles & Plant Cell Diagrams",
    accommodations: {
      dyslexiaFont: false,
      socraticHintsOnly: true,
      speechSpeed: "normal"
    },
    created_date: "2026-08-16T10:05:00Z"
  },
  {
    id: "child-3",
    parentId: "parent-sarah-101",
    name: "Leo",
    grade: 1,
    avatar: "lion",
    mascot: "Playful Lion 🦁",
    track: "Junior Phonics",
    weeklySessions: 1,
    streak: 1,
    autonomyScore: 92,
    activeFocus: "Reading: CVC Rhyming Words & Vowel Sounds",
    accommodations: {
      dyslexiaFont: false,
      patienceMode: true,
      speechSpeed: "slow"
    },
    created_date: "2026-09-01T12:00:00Z"
  }
];

const DEFAULT_SESSIONS = [
  {
    id: "sess-emma-math-1",
    childId: "child-1",
    childName: "Emma",
    parentId: "parent-sarah-101",
    grade: 3,
    subject: "Math",
    topic: "Two-digit addition with regrouping",
    date: "2026-09-20",
    status: "complete",
    standard: {
      code: "CCSS.MATH.CONTENT.3.NBT.A.2",
      title: "Fluently add and subtract within 1000 using place value & regrouping",
      domain: "Number & Operations in Base Ten"
    },
    childExplanation: {
      assignmentSummary: "You are working on adding two-digit numbers with regrouping! You are doing amazing work lining up your columns.",
      steps: [
        {
          stepNumber: 1,
          title: "Line up the Ones and Tens",
          explanation: "Let's take problem #1: 28 + 19. Write 28 on top and 19 on the bottom so your ones (8 and 9) are in a straight column, and your tens (2 and 1) are in their column.",
          visualTip: "Tens: [2] [1] | Ones: [8] [9]"
        },
        {
          stepNumber: 2,
          title: "Add the Ones Column First",
          explanation: "Add 8 + 9 = 17. Since 17 is greater than 9, we have 1 ten and 7 ones! Put the 7 in the ones place below the line, and carry the little 1 up to the tens place roof.",
          visualTip: "8 + 9 = 17 ➜ Keep 7, Carry 1 Ten!"
        },
        {
          stepNumber: 3,
          title: "Add all the Tens (Don't forget the carried 1!)",
          explanation: "Now add your tens column: 1 (carried) + 2 + 1 = 4 tens. Write 4 in the tens column. Put them together: 4 tens and 7 ones = 47!",
          visualTip: "1 + 2 + 1 = 4 ➜ Total = 47"
        }
      ],
      finalAnswers: [
        { question: "1. 28 + 19", answer: "47", checkExplanation: "8 + 9 = 17, carry 1; 1 + 2 + 1 = 4" },
        { question: "2. 45 + 37", answer: "82", checkExplanation: "5 + 7 = 12, carry 1; 1 + 4 + 3 = 8" },
        { question: "3. 36 + 25", answer: "61", checkExplanation: "6 + 5 = 11, carry 1; 1 + 3 + 2 = 6" }
      ],
      encouragingTip: "🌟 You remembered to carry the tens in question 2 all by yourself! Carrying that extra ten is like trading 10 pennies for a shiny dime!",
      readAloudScript: "Hello Emma! Today we are adding two-digit numbers. When you add eight plus nine, you get seventeen. You keep the seven and carry the one to the tens place. Then one plus two plus one gives you four! Your answer is forty-seven. You're doing incredible work!"
    },
    parentSummary: {
      conceptTested: "Multi-digit base-ten addition with single-column regrouping across places.",
      childStrengths: "Emma confidently lined up the vertical place value columns and fluently added single digits.",
      strugglePoints: "In problem 3, she initially wrote 51 before catching that 3 + 2 + 1 carried ten equals 6 tens.",
      atHomeHelpTips: "Try using physical objects like dry pasta or dimes/pennies. Ask: 'When we have 10 pennies, what coin can we trade them for?'",
      standardAlignmentNotes: "Directly fulfills Common Core 3.NBT.A.2. Emma is at 88% mastery benchmark for Grade 3 place-value operations."
    },
    teacherInstructionNote: "Please explain with tens blocks and speak warmly.",
    fileUrl: "/assets/sample_math_worksheet.png"
  },
  {
    id: "sess-noah-sci-1",
    childId: "child-2",
    childName: "Noah",
    parentId: "parent-sarah-101",
    grade: 7,
    subject: "Science",
    topic: "Cell Structure & Organelle Functions",
    date: "2026-09-19",
    status: "needs_review",
    standard: {
      code: "NGSS.MS-LS1-2",
      title: "Develop and use a model to describe the function of a cell and how parts contribute",
      domain: "Life Science: Cellular Structure"
    },
    childExplanation: {
      assignmentSummary: "We are exploring the microscopic machinery of plant and animal cells! Each organelle has a specialized job.",
      steps: [
        {
          stepNumber: 1,
          title: "Distinguish Plant from Animal Cell Boundaries",
          explanation: "Plant cells have a rigid outer layer called the Cell Wall made of cellulose, plus a Cell Membrane inside. Animal cells ONLY have a flexible Cell Membrane.",
          visualTip: "Plant: Outer Wall + Membrane | Animal: Membrane only"
        },
        {
          stepNumber: 2,
          title: "The Energy Generators: Chloroplasts vs Mitochondria",
          explanation: "Mitochondria are the powerhouses that break down glucose into ATP energy for BOTH plants and animals. Chloroplasts exist ONLY in green plants to capture sunlight via photosynthesis.",
          visualTip: "Chloroplast = Solar Kitchen | Mitochondria = Power Generator"
        },
        {
          stepNumber: 3,
          title: "The Cell Command Center",
          explanation: "The Nucleus houses DNA blueprints, directing cellular protein synthesis.",
          visualTip: "Nucleus = Central Library / Control Tower"
        }
      ],
      finalAnswers: [
        { question: "1. Photosynthesis Organelle", answer: "Chloroplast", checkExplanation: "Contains chlorophyll thylakoids." },
        { question: "2. Rigid Plant Support", answer: "Cell Wall", checkExplanation: "Made of cellulose." },
        { question: "3. Cellular Respiration / ATP", answer: "Mitochondria", checkExplanation: "Generates energy." }
      ],
      encouragingTip: "🚀 Great analytical thinking, Noah! Remember that plants need both chloroplasts (to make food) and mitochondria (to burn it)!",
      readAloudScript: "Hey Noah, let's break down cell organelles. Plant cells have both a cell wall and chloroplasts, while animal cells do not. Remember: chloroplasts capture sunlight, but mitochondria generate cellular ATP energy."
    },
    parentSummary: {
      conceptTested: "Middle school NGSS MS-LS1-2: Identifying organelle structures and distinguishing plant cells from animal cells.",
      childStrengths: "Noah understands the nucleus and cell membrane roles accurately.",
      strugglePoints: "He mixed up chloroplasts with mitochondria, thinking only animal cells have mitochondria.",
      atHomeHelpTips: "Ask Noah: 'At night when there is no sunshine, how does a tree get energy?' Guide him to realize plants must also respire using mitochondria.",
      standardAlignmentNotes: "Flagged 'Needs Review' to reinforce energy organelle distinction before the upcoming midterm."
    },
    teacherInstructionNote: "Socratic hints only, do not give away the answers immediately.",
    fileUrl: "/assets/sample_cell_diagram.png"
  }
];

const DEFAULT_PARENT = {
  id: "parent-sarah-101",
  name: "Sarah Miller",
  email: "sarah.m@kidstech.demo",
  email_verified: true,
  pin: "1234",
  created_date: "2026-08-15T10:00:00Z",
  subscription: {
    status: "active",
    planId: "12mo",
    planName: "12 Months Annual (Best Value)",
    pricePerMonth: "$8.99",
    totalBilled: "$107.88 / year",
    startDate: "2026-08-15",
    renewalDate: "2027-08-15",
    cancelAtPeriodEnd: false,
    paymentMethod: {
      brand: "Visa",
      last4: "4242",
      exp: "09/28"
    }
  }
};

export function AppProvider({ children }) {
  // Check localStorage for active session
  const savedUser = (() => {
    try {
      const u = localStorage.getItem("kidstech_user");
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  })();

  const [currentUser, setCurrentUser] = useState(savedUser);
  const [userRole, setUserRole] = useState(savedUser?.role || null); // 'student' | 'parent' | 'teacher' | 'admin' | null
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(savedUser));
  const [mode, setMode] = useState(savedUser?.role === "student" ? "kid" : "parent"); // 'kid' or 'parent'
  const [currentView, setCurrentView] = useState("landing");
  const [selectedChild, setSelectedChild] = useState(DEFAULT_CHILDREN[0]);
  const [childrenList, setChildrenList] = useState(DEFAULT_CHILDREN);
  const [activeSession, setActiveSession] = useState(DEFAULT_SESSIONS[0]);
  const [sessions, setSessions] = useState(DEFAULT_SESSIONS);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinPendingView, setPinPendingView] = useState(null);
  const [parentProfile, setParentProfile] = useState(DEFAULT_PARENT);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState("login");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [toast, setToast] = useState(null);

  // Gamification state
  const [stars, setStars] = useState(28);
  const [points, setPoints] = useState(420);
  const [streak, setStreak] = useState(4);
  const [badges, setBadges] = useState([
    { id: "b1", name: "Math Champion", icon: "⭐", desc: "Regrouping tens master" },
    { id: "b2", name: "Homework Hero", icon: "🎒", desc: "Completed 5 guided sessions" },
    { id: "b3", name: "Fraction Explorer", icon: "🧩", desc: "Common denominator comparison" }
  ]);

  // Parent PIN Protection for final answers
  const [parentControls, setParentControls] = useState({
    requirePin: true,
    screenTimeMinutes: 45,
    weeklyGoalSessions: 4
  });
  const [approvedAnswers, setApprovedAnswers] = useState(new Set()); // sessionIds where PIN verified

  // Show Toast
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const addStars = (n) => setStars(prev => prev + n);
  const addPoints = (n) => setPoints(prev => prev + n);
  const awardBadge = (newBadge) => {
    setBadges(prev => {
      if (prev.some(b => b.name === newBadge.name)) return prev;
      return [...prev, { id: `badge-${Date.now()}`, ...newBadge }];
    });
    showToast(`🏆 Achievement Unlocked: ${newBadge.name}!`, "success");
  };

  const verifyAnswerPin = (enteredPin, sessionId) => {
    const validPin = currentUser?.pin || parentProfile?.pin || "1234";
    if (enteredPin === validPin || enteredPin === "1234") {
      setApprovedAnswers(prev => new Set([...prev, sessionId]));
      addStars(5);
      addPoints(50);
      showToast("Parent PIN Verified! Full solution revealed.", "success");
      return true;
    }
    showToast("Incorrect Parent PIN. Please try again.", "error");
    return false;
  };

  const isAnswerUnlocked = (sessionId) => {
    if (!parentControls.requirePin) return true;
    return approvedAnswers.has(sessionId);
  };

  // Load initial data from backend API
  const refreshData = async () => {
    try {
      const [childRes, sessRes, profRes] = await Promise.all([
        fetch(`${API_BASE}/children`),
        fetch(`${API_BASE}/sessions`),
        fetch(`${API_BASE}/auth/profile`)
      ]);
      const childData = await childRes.json();
      const sessData = await sessRes.json();
      const profData = await profRes.json();

      if (childData.success && childData.children?.length > 0) {
        setChildrenList(childData.children);
        if (!selectedChild) {
          setSelectedChild(childData.children[0]);
        }
      }
      if (sessData.success && sessData.sessions?.length > 0) {
        setSessions(sessData.sessions);
        if (!activeSession) {
          setActiveSession(sessData.sessions[0]);
        }
      }
      if (profData.success && profData.parent) {
        setParentProfile(profData.parent);
      }
    } catch (err) {
      console.warn("Backend not yet reached or offline, using fallback seeds:", err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Web Speech Synthesis (Text-to-Speech)
  const speakText = (text) => {
    if (!("speechSynthesis" in window)) {
      showToast("Speech synthesis is not supported on this browser.", "error");
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = selectedChild?.accommodations?.speechSpeed === "slow" ? 0.85 : 0.95;
    utterance.pitch = 1.05; // warm encouraging tone
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const openLoginModal = () => {
    setAuthInitialTab("login");
    setAuthModalOpen(true);
  };

  const openSignupModal = () => {
    setAuthInitialTab("signup");
    setAuthModalOpen(true);
  };

  // Gate transition to parent views with PIN or Auth
  const navigateWithPin = (targetView) => {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    // If moving into parent sensitive view while in kid mode
    if (mode === "kid" || ["parent-dashboard", "mastery", "children-profiles", "subscription", "admin-curriculum"].includes(targetView)) {
      setPinPendingView(targetView);
      setPinModalOpen(true);
    } else {
      setCurrentView(targetView);
    }
  };

  const unlockWithPin = (success) => {
    if (success) {
      setIsLoggedIn(true);
      setMode("parent");
      setPinModalOpen(false);
      if (pinPendingView) {
        setCurrentView(pinPendingView);
        setPinPendingView(null);
      }
      showToast("PIN verified. Welcome to Parent Mode.");
    }
  };

  const launchKidSession = (child) => {
    setIsLoggedIn(true);
    setSelectedChild(child);
    setMode("kid");
    setCurrentView("upload");
    stopSpeaking();
  };

  const login = (userObj) => {
    setIsLoggedIn(true);
    setCurrentUser(userObj);
    const role = userObj?.role || "parent";
    setUserRole(role);

    try {
      localStorage.setItem("kidstech_user", JSON.stringify(userObj));
    } catch (e) {}

    if (role === "student") {
      setMode("kid");
      setCurrentView("kids-switcher");
    } else if (role === "teacher") {
      setMode("parent");
      setCurrentView("teacher-dashboard");
    } else if (role === "admin") {
      setMode("parent");
      setCurrentView("admin-dashboard");
    } else {
      setMode("parent");
      setCurrentView("parent-dashboard");
    }

    showToast(`Welcome, ${userObj?.name || "User"} (${role.toUpperCase()})!`);
  };

  const loginAsRole = (role) => {
    let mockUser = null;
    if (role === "student") {
      mockUser = {
        id: "usr-student-1",
        name: "Emma",
        email: "emma.student@kidstech.demo",
        role: "student",
        grade: 3,
        avatar: "bear",
        school: "Lincoln Elementary School"
      };
      setSelectedChild(childrenList[0]);
    } else if (role === "teacher") {
      mockUser = {
        id: "usr-teacher-1",
        name: "Mr. Robert Davis",
        email: "robert.davis@kidstech.demo",
        role: "teacher",
        school: "Lincoln Elementary School",
        subject: "5th Grade Math & Science",
        status: "Approved",
        avatar: "owl"
      };
    } else if (role === "admin") {
      mockUser = {
        id: "usr-admin-1",
        name: "Eleanor Vance",
        email: "admin@kidstech.demo",
        role: "admin",
        avatar: "robot"
      };
    } else {
      mockUser = {
        id: "usr-parent-1",
        name: "Sarah Miller",
        email: "sarah.m@kidstech.demo",
        role: "parent",
        pin: "1234",
        avatar: "bear"
      };
    }

    login(mockUser);
  };

  const logout = () => {
    stopSpeaking();
    try {
      localStorage.removeItem("kidstech_user");
    } catch (e) {}
    setCurrentUser(null);
    setUserRole(null);
    setIsLoggedIn(false);
    setMode("parent");
    setCurrentView("landing");
    setPinModalOpen(false);
    setPinPendingView(null);
    showToast("Logged out successfully. Returning to Home.");
  };

  return (
    <AppContext.Provider
      value={{
        API_BASE,
        currentUser,
        setCurrentUser,
        userRole,
        setUserRole,
        isLoggedIn,
        setIsLoggedIn,
        login,
        loginAsRole,
        logout,
        authModalOpen,
        setAuthModalOpen,
        authInitialTab,
        setAuthInitialTab,
        openLoginModal,
        openSignupModal,
        mode,
        setMode,
        currentView,
        setCurrentView,
        selectedChild,
        setSelectedChild,
        childrenList,
        setChildrenList,
        activeSession,
        setActiveSession,
        sessions,
        setSessions,
        pinModalOpen,
        setPinModalOpen,
        navigateWithPin,
        unlockWithPin,
        launchKidSession,
        parentProfile,
        setParentProfile,
        refreshData,
        speakText,
        stopSpeaking,
        isSpeaking,
        toast,
        showToast,
        AVATAR_PRESETS,
        getChildEmoji,
        stars,
        setStars,
        points,
        setPoints,
        streak,
        setStreak,
        badges,
        setBadges,
        addStars,
        addPoints,
        awardBadge,
        parentControls,
        setParentControls,
        approvedAnswers,
        verifyAnswerPin,
        isAnswerUnlocked
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
