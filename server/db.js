// db.js - In-memory and persistent database with rich seed data matching Stitch screens
import { v4 as uuidv4 } from "uuid";

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

const initialParent = {
  id: "parent-sarah-101",
  name: "Sarah Miller",
  email: "sarah.m@kidstech.demo",
  password: "password123",
  email_verified: true,
  pin: "1234",
  provider: "email",
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

export const db = {
  parents: [initialParent],
  parent: initialParent,
  pendingVerifications: {},

  children: [
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
  ],

  sessions: [
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
        encouragingTip: "🌟 You remembered to carry the tens in question 2 all by yourself! Notice how 5 + 7 makes 12 — carrying that extra ten is like trading 10 pennies for a shiny dime!",
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
            title: "Distinguish Plant from Animal Cell Walls",
            explanation: "Plant cells have a rigid outer layer called the Cell Wall made of cellulose, plus a Cell Membrane inside. Animal cells ONLY have a flexible Cell Membrane.",
            visualTip: "Plant: Outer Wall + Membrane | Animal: Membrane only"
          },
          {
            stepNumber: 2,
            title: "The Energy Generators: Chloroplasts vs Mitochondria",
            explanation: "Mitochondria are the 'powerhouses' that break down glucose into ATP energy for BOTH plants and animals. Chloroplasts exist ONLY in green plant cells to capture sunlight and make glucose through photosynthesis.",
            visualTip: "Chloroplast = Solar Kitchen | Mitochondria = Power Generator"
          },
          {
            stepNumber: 3,
            title: "The Cell Command Center",
            explanation: "The Nucleus houses DNA blueprints, directing protein synthesis via Ribosomes.",
            visualTip: "Nucleus = Central Library / Control Tower"
          }
        ],
        finalAnswers: [
          { question: "1. Which organelle performs photosynthesis?", answer: "Chloroplast", checkExplanation: "Contains chlorophyll pigment to harvest light photons." },
          { question: "2. What structure provides rigid structural support to plant cells?", answer: "Cell Wall", checkExplanation: "Made of strong cellulose fibers." },
          { question: "3. Where is cellular respiration carried out?", answer: "Mitochondria", checkExplanation: "Produces ATP energy molecules." }
        ],
        encouragingTip: "🚀 Great analytical thinking on question 1, Noah! Remember that both plants and animals have mitochondria — plants make food with chloroplasts, but they still need mitochondria to burn it!",
        readAloudScript: "Hey Noah, let's break down cell organelles. Plant cells have both a cell wall and chloroplasts, while animal cells do not. Remember: chloroplasts capture sunlight, but mitochondria generate the cellular ATP energy."
      },
      parentSummary: {
        conceptTested: "Middle school NGSS MS-LS1-2: Identifying organelle structures and distinguishing autotrophic plant cells from heterotrophic animal cells.",
        childStrengths: "Noah understands the nucleus and cell membrane roles accurately.",
        strugglePoints: "He mixed up chloroplasts with mitochondria, thinking only animal cells have mitochondria.",
        atHomeHelpTips: "Ask Noah: 'At night when there is no sunshine, how does a tree get energy?' Guide him to realize plants must also respire using mitochondria.",
        standardAlignmentNotes: "Flagged 'Needs Review' to reinforce energy organelle distinction before the upcoming midterm."
      },
      teacherInstructionNote: "Socratic hints only, do not give away the answers immediately.",
      fileUrl: "/assets/sample_cell_diagram.png"
    },
    {
      id: "sess-emma-read-1",
      childId: "child-1",
      childName: "Emma",
      parentId: "parent-sarah-101",
      grade: 3,
      subject: "Reading-Writing",
      topic: "Main Idea & Supporting Details: 'The Honeybee Colony'",
      date: "2026-09-17",
      status: "needs_review",
      standard: {
        code: "CCSS.ELA-LITERACY.RI.3.2",
        title: "Determine the main idea of an informational text; recount key details",
        domain: "Reading: Informational Text"
      },
      childExplanation: {
        assignmentSummary: "We are reading about honeybees and finding the single big idea that all the paragraphs talk about!",
        steps: [
          {
            stepNumber: 1,
            title: "Look for the Umbrella Idea",
            explanation: "Ask: 'What is the ONE big point the author wants me to know?' Details like the waggle dance and queen bee support the big point.",
            visualTip: "Big Umbrella = Main Idea | Raindrops = Supporting Details"
          }
        ],
        finalAnswers: [
          { question: "1. What is the main idea of paragraph 2?", answer: "Honeybees work together in specialized roles to keep the hive alive.", checkExplanation: "Every worker bee has a specific chore." }
        ],
        encouragingTip: "🍯 You found the detail about the queen bee super fast! Remember the difference between an interesting fact and the big umbrella idea.",
        readAloudScript: "Great job working on your reading assignment! Honeybees have amazing teamwork. When looking for the main idea, think of an umbrella holding all the facts together."
      },
      parentSummary: {
        conceptTested: "CCSS.ELA-LITERACY.RI.3.2 - Identifying main idea vs supporting facts.",
        childStrengths: "High reading fluency and vocabulary comprehension.",
        strugglePoints: "Selected a cool interesting fact ('bees dance') instead of the broader main idea.",
        atHomeHelpTips: "When reading bedtime stories, ask: 'If you had to tell grandma what this chapter was about in 1 sentence, what would you say?'",
        standardAlignmentNotes: "Needs Review flag applied to monitor main-idea extraction over the next 2 assignments."
      },
      teacherInstructionNote: "Keep sentences short and encouraging.",
      fileUrl: "/assets/sample_reading_bees.png"
    }
  ],

  practiceWorksheets: [
    {
      id: "ws-math-regroup-grade3",
      grade: 3,
      subject: "Math",
      title: "Grade 3 Two-Digit Regrouping Master Worksheet",
      standard: "CCSS.MATH.CONTENT.3.NBT.A.2",
      problems: [
        { id: 1, problem: "34 + 28", answer: "62" },
        { id: 2, problem: "56 + 19", answer: "75" },
        { id: 3, problem: "47 + 36", answer: "83" },
        { id: 4, problem: "68 + 24", answer: "92" },
        { id: 5, problem: "29 + 53", answer: "82" },
        { id: 6, problem: "75 + 18", answer: "93" }
      ]
    }
  ],

  pricingPlans: [
    {
      id: "3mo",
      title: "3 Months",
      pricePerMonth: "$14.99",
      billingPeriod: "Billed $44.97 every 3 months",
      badge: "Flexible Starter",
      popular: false,
      savings: null,
      features: [
        "Unlimited homework uploads",
        "Grade 1–12 AI Teacher Agent",
        "Parent diagnostic summaries",
        "Audio teacher text-to-speech",
        "Cancel anytime"
      ]
    },
    {
      id: "6mo",
      title: "6 Months",
      pricePerMonth: "$11.99",
      billingPeriod: "Billed $71.94 every 6 months",
      badge: "Semester Pass",
      popular: false,
      savings: "Save 20%",
      features: [
        "Everything in 3 Months",
        "Up to 3 child profiles",
        "Common Core & NGSS progress reports",
        "Printable worksheet generator",
        "Priority AI processing"
      ]
    },
    {
      id: "12mo",
      title: "12 Months (Full School Year)",
      pricePerMonth: "$8.99",
      billingPeriod: "Billed $107.88 annually",
      badge: "Best Value ★",
      popular: true,
      savings: "Save 40%",
      features: [
        "Everything in 6 Months",
        "Unlimited child profiles",
        "Accommodations suite (Dyslexia font, Patience mode)",
        "Comprehensive Standards Mastery dashboard",
        "Priority 24/7 guardian support",
        "Cancel anytime guarantee"
      ]
    }
  ],

  invoices: [
    { id: "inv-2026-08", date: "Aug 15, 2026", amount: "$107.88", plan: "12 Months Annual (Best Value)", status: "Paid", receiptUrl: "#" }
  ],

  users: [
    {
      id: "usr-admin-1",
      name: "Eleanor Vance",
      email: "admin@kidstech.demo",
      password: "password123",
      role: "admin",
      status: "active",
      pin: "9999",
      school: "KidsTech District Oversight",
      subject: "Platform Administrator",
      grade: null,
      parent_name: "",
      avatar: "robot",
      created_date: "2026-01-15T09:00:00Z",
      login_history: [
        { ip: "192.168.1.1", time: "2026-11-03T08:30:00Z", device: "Chrome / Windows 11", status: "Success" },
        { ip: "192.168.1.1", time: "2026-11-02T14:15:00Z", device: "Chrome / Windows 11", status: "Success" }
      ]
    },
    {
      id: "usr-teacher-1",
      name: "Mr. Robert Davis",
      email: "robert.davis@kidstech.demo",
      password: "password123",
      role: "teacher",
      status: "active",
      pin: "1234",
      school: "Lincoln Elementary School",
      subject: "5th Grade Math & Science",
      grade: 5,
      parent_name: "",
      avatar: "owl",
      created_date: "2026-03-10T10:00:00Z",
      login_history: [
        { ip: "10.0.4.12", time: "2026-11-03T07:45:00Z", device: "Safari / macOS", status: "Success" }
      ]
    },
    {
      id: "usr-teacher-2",
      name: "Ms. Amanda Clark",
      email: "amanda.clark@kidstech.demo",
      password: "password123",
      role: "teacher",
      status: "pending_verification",
      pin: "1234",
      school: "Oakridge Middle School",
      subject: "7th Grade STEM",
      grade: 7,
      parent_name: "",
      avatar: "fox",
      created_date: "2026-08-20T11:30:00Z",
      login_history: [
        { ip: "172.16.8.21", time: "2026-10-30T16:20:00Z", device: "Chrome / ChromeOS", status: "Success" }
      ]
    },
    {
      id: "usr-teacher-3",
      name: "Mr. David Miller",
      email: "david.miller@kidstech.demo",
      password: "password123",
      role: "teacher",
      status: "rejected",
      pin: "1234",
      school: "Pine Valley Academy",
      subject: "4th Grade English",
      grade: 4,
      parent_name: "",
      avatar: "bear",
      created_date: "2026-07-04T12:00:00Z",
      login_history: [
        { ip: "10.2.1.88", time: "2026-09-12T09:10:00Z", device: "Edge / Windows", status: "Success" }
      ]
    },
    {
      id: "usr-parent-1",
      name: "Sarah Miller",
      email: "sarah.m@kidstech.demo",
      password: "password123",
      role: "parent",
      status: "active",
      pin: "1234",
      school: "",
      subject: "",
      grade: null,
      parent_name: "",
      avatar: "bear",
      created_date: "2026-08-15T10:00:00Z",
      login_history: [
        { ip: "192.168.0.14", time: "2026-11-03T08:12:00Z", device: "Mobile Safari / iOS 19", status: "Success" }
      ]
    },
    {
      id: "usr-parent-2",
      name: "Marcus Reed",
      email: "marcus.r@kidstech.demo",
      password: "password123",
      role: "parent",
      status: "active",
      pin: "5678",
      school: "",
      subject: "",
      grade: null,
      parent_name: "",
      avatar: "lion",
      created_date: "2026-09-02T14:00:00Z",
      login_history: [
        { ip: "192.168.2.55", time: "2026-10-29T18:40:00Z", device: "Firefox / Android", status: "Success" }
      ]
    },
    {
      id: "usr-student-1",
      name: "Emma",
      email: "emma.student@kidstech.demo",
      password: "password123",
      role: "student",
      status: "active",
      pin: "",
      school: "Lincoln Elementary School",
      subject: "Grade 3",
      grade: 3,
      parent_name: "Sarah Miller",
      avatar: "bear",
      created_date: "2026-08-16T10:00:00Z",
      login_history: [
        { ip: "192.168.0.14", time: "2026-11-02T16:00:00Z", device: "iPad / Safari", status: "Success" }
      ]
    },
    {
      id: "usr-student-2",
      name: "Noah",
      email: "noah.student@kidstech.demo",
      password: "password123",
      role: "student",
      status: "active",
      pin: "",
      school: "Oakridge Middle School",
      subject: "Grade 7",
      grade: 7,
      parent_name: "Sarah Miller",
      avatar: "fox",
      created_date: "2026-08-16T10:05:00Z",
      login_history: [
        { ip: "192.168.0.18", time: "2026-11-01T17:30:00Z", device: "MacBook / Chrome", status: "Success" }
      ]
    },
    {
      id: "usr-student-3",
      name: "Leo",
      email: "leo.student@kidstech.demo",
      password: "password123",
      role: "student",
      status: "active",
      pin: "",
      school: "Lincoln Elementary School",
      subject: "Grade 1",
      grade: 1,
      parent_name: "Sarah Miller",
      avatar: "lion",
      created_date: "2026-09-01T12:00:00Z",
      login_history: [
        { ip: "192.168.0.14", time: "2026-10-28T15:00:00Z", device: "iPad / Safari", status: "Success" }
      ]
    }
  ],

  teacherVerifications: [
    {
      id: "tv-1",
      userId: "usr-teacher-1",
      name: "Mr. Robert Davis",
      email: "robert.davis@kidstech.demo",
      school: "Lincoln Elementary School",
      licenseNumber: "TX-EDU-98214-G5",
      subject: "Elementary STEM & Math",
      status: "Approved",
      documents: [
        { name: "Texas_Standard_Educator_Certificate.pdf", size: "2.4 MB", type: "pdf" },
        { name: "FBI_Fingerprint_Clearance_2026.pdf", size: "1.1 MB", type: "pdf" }
      ],
      notes: "Verified with Texas Education Agency registry. Clear background check on file.",
      created_date: "2026-03-10T10:00:00Z",
      updated_date: "2026-03-11T14:20:00Z"
    },
    {
      id: "tv-2",
      userId: "usr-teacher-2",
      name: "Ms. Amanda Clark",
      email: "amanda.clark@kidstech.demo",
      school: "Oakridge Middle School",
      licenseNumber: "CA-TEACH-55410-SCI",
      subject: "Middle School General Science",
      status: "Pending",
      documents: [
        { name: "California_Preliminary_Teaching_Credential.pdf", size: "3.2 MB", type: "pdf" }
      ],
      notes: "Submitted credentials for verification. Waiting on district email validation.",
      created_date: "2026-08-20T11:30:00Z",
      updated_date: "2026-08-20T11:30:00Z"
    },
    {
      id: "tv-3",
      userId: "usr-teacher-3",
      name: "Mr. David Miller",
      email: "david.miller@kidstech.demo",
      school: "Pine Valley Academy",
      licenseNumber: "FL-EXPIRED-1102",
      subject: "English Language Arts",
      status: "Rejected",
      documents: [
        { name: "Florida_Teaching_License_2023.pdf", size: "1.8 MB", type: "pdf" }
      ],
      notes: "Credential document submitted expired on 06/2024. Requested renewed state certificate.",
      created_date: "2026-07-04T12:00:00Z",
      updated_date: "2026-07-06T09:15:00Z"
    }
  ],

  payments: [
    {
      id: "pay-101",
      userId: "usr-parent-1",
      userName: "Sarah Miller",
      amount: 107.88,
      planId: "12mo",
      planName: "12 Months Annual (Best Value)",
      status: "Succeeded",
      date: "2026-08-15",
      invoiceNum: "INV-2026-0081",
      paymentMethod: "Visa •••• 4242",
      refundReason: null
    },
    {
      id: "pay-102",
      userId: "usr-parent-2",
      userName: "Marcus Reed",
      amount: 71.94,
      planId: "6mo",
      planName: "6 Months Semester Pass",
      status: "Succeeded",
      date: "2026-09-02",
      invoiceNum: "INV-2026-0094",
      paymentMethod: "Mastercard •••• 5512",
      refundReason: null
    },
    {
      id: "pay-103",
      userId: "usr-parent-3",
      userName: "Jessica Chen",
      amount: 44.97,
      planId: "3mo",
      planName: "3 Months Starter",
      status: "Succeeded",
      date: "2026-10-12",
      invoiceNum: "INV-2026-0112",
      paymentMethod: "Amex •••• 3009",
      refundReason: null
    },
    {
      id: "pay-104",
      userId: "usr-parent-4",
      userName: "Carlos Gomez",
      amount: 107.88,
      planId: "12mo",
      planName: "12 Months Annual (Best Value)",
      status: "Succeeded",
      date: "2026-10-28",
      invoiceNum: "INV-2026-0128",
      paymentMethod: "Apple Pay",
      refundReason: null
    },
    {
      id: "pay-105",
      userId: "usr-parent-5",
      userName: "Brian Taylor",
      amount: 44.97,
      planId: "3mo",
      planName: "3 Months Starter",
      status: "Refunded",
      date: "2026-10-05",
      invoiceNum: "INV-2026-0105",
      paymentMethod: "Visa •••• 1198",
      refundReason: "Accidental duplicate family subscription requested by guardian."
    },
    {
      id: "pay-106",
      userId: "usr-parent-6",
      userName: "Ashley White",
      amount: 107.88,
      planId: "12mo",
      planName: "12 Months Annual (Best Value)",
      status: "Failed",
      date: "2026-11-01",
      invoiceNum: "INV-2026-0135",
      paymentMethod: "Visa •••• 7741",
      refundReason: "Card declined by issuing bank (insufficient funds / expired card)."
    },
    {
      id: "pay-107",
      userId: "usr-parent-7",
      userName: "Patricia Hill",
      amount: 71.94,
      planId: "6mo",
      planName: "6 Months Semester Pass",
      status: "Succeeded",
      date: "2026-11-02",
      invoiceNum: "INV-2026-0139",
      paymentMethod: "Google Pay",
      refundReason: null
    }
  ],

  moderationItems: [
    {
      id: "mod-1",
      type: "Worksheet Image",
      studentName: "Emma",
      subject: "Math",
      content: "Grade 3 multi-digit addition worksheet with regrouping columns",
      fileUrl: "/assets/sample_math_worksheet.png",
      flagReason: "None - Routine upload",
      safetyScore: "99.8%",
      status: "Approved",
      created_date: "2026-09-20T14:10:00Z"
    },
    {
      id: "mod-2",
      type: "Diagram Image",
      studentName: "Noah",
      subject: "Science",
      content: "Plant and animal cell microscopic diagram with organelle callouts",
      fileUrl: "/assets/sample_cell_diagram.png",
      flagReason: "None - Routine upload",
      safetyScore: "99.9%",
      status: "Approved",
      created_date: "2026-09-19T16:22:00Z"
    },
    {
      id: "mod-3",
      type: "Reading Passage",
      studentName: "Emma",
      subject: "Reading",
      content: "Informational text excerpt on honeybee hive roles and social structure",
      fileUrl: "/assets/sample_reading_bees.png",
      flagReason: "None - Routine upload",
      safetyScore: "100%",
      status: "Approved",
      created_date: "2026-09-17T11:05:00Z"
    },
    {
      id: "mod-4",
      type: "Photo Upload",
      studentName: "Aiden Scott",
      subject: "Math",
      content: "Low contrast dimly lit handwriting on lined paper",
      fileUrl: "/assets/sample_math_worksheet.png",
      flagReason: "Image Quality Warning (Blurry OCR)",
      safetyScore: "94.2%",
      status: "Flagged",
      created_date: "2026-10-25T17:40:00Z"
    },
    {
      id: "mod-5",
      type: "Student Prompt",
      studentName: "Maya Lin",
      subject: "General",
      content: "Write me an entire 5-page essay on Minecraft mechanics without hints",
      fileUrl: "",
      flagReason: "Policy Reminder: Direct Answer Copying Prevention",
      safetyScore: "88.0%",
      status: "Flagged",
      created_date: "2026-10-31T19:15:00Z"
    }
  ],

  auditLogs: [
    {
      id: "log-1",
      timestamp: "2026-11-03T08:15:22Z",
      actorName: "Admin Eleanor Vance",
      actorRole: "admin",
      action: "TEACHER_APPROVAL",
      target: "Mr. Robert Davis (usr-teacher-1)",
      details: "Approved state credentials TX-EDU-98214-G5 for Lincoln Elementary."
    },
    {
      id: "log-2",
      timestamp: "2026-11-02T16:30:10Z",
      actorName: "Teacher Robert Davis",
      actorRole: "teacher",
      action: "HOMEWORK_FEEDBACK_ADDED",
      target: "Emma (sess-emma-math-1)",
      details: "Provided guided encouragement on regrouping tens columns."
    },
    {
      id: "log-3",
      timestamp: "2026-11-01T14:05:44Z",
      actorName: "Parent Sarah Miller",
      actorRole: "parent",
      action: "PARENT_PIN_VERIFIED",
      target: "sess-emma-math-1",
      details: "Unlocked final solution after Emma completed guided steps and mini-quiz."
    },
    {
      id: "log-4",
      timestamp: "2026-10-31T19:16:02Z",
      actorName: "KidsTech AI Guard",
      actorRole: "system",
      action: "CONTENT_FLAGGED",
      target: "Student Maya Lin Submission",
      details: "Flagged direct essay generation request; redirected to Socratic outline."
    },
    {
      id: "log-5",
      timestamp: "2026-10-28T10:45:18Z",
      actorName: "Admin Eleanor Vance",
      actorRole: "admin",
      action: "REFUND_PROCESSED",
      target: "Brian Taylor ($44.97)",
      details: "Approved accidental duplicate billing refund."
    }
  ],

  parentControls: {
    "parent-sarah-101": {
      parentId: "parent-sarah-101",
      requirePin: true,
      screenTimeMinutes: 45,
      weeklyGoalSessions: 4,
      pendingApprovals: []
    }
  },

  teacherFeedback: [
    {
      id: "tfb-1",
      sessionId: "sess-emma-math-1",
      studentId: "child-1",
      teacherName: "Mr. Robert Davis",
      message: "Outstanding work lining up your columns Emma! Remember to keep carrying the 1 ten onto the roof when you practice tonight.",
      created_date: "2026-11-02T16:30:10Z"
    },
    {
      id: "tfb-2",
      sessionId: "sess-noah-sci-1",
      studentId: "child-2",
      teacherName: "Mr. Robert Davis",
      message: "Great effort on plant and animal organelle distinctions, Noah! Pay close attention to how chloroplasts and mitochondria work as a team.",
      created_date: "2026-11-01T11:20:00Z"
    }
  ]
};

import {
  seedDefaultDataIfEmpty,
  loadAllData,
  persistParent,
  persistChild,
  deleteChildFromSqlite,
  persistSession,
  persistPendingVerification,
  removePendingVerification,
  purgeCOPPAData,
  persistUser,
  deleteUserFromSqlite,
  persistTeacherVerification,
  persistPayment,
  persistModerationItem,
  persistAuditLog,
  persistParentControls,
  persistTeacherFeedback
} from "./sqliteDb.js";

// Initialize SQLite with initial seed data if fresh, otherwise load persistent records
try {
  seedDefaultDataIfEmpty({
    initialParents: db.parents,
    initialChildren: db.children,
    initialSessions: db.sessions,
    initialUsers: db.users,
    initialTeacherVerifications: db.teacherVerifications,
    initialPayments: db.payments,
    initialModerationItems: db.moderationItems,
    initialAuditLogs: db.auditLogs,
    initialParentControls: db.parentControls,
    initialTeacherFeedback: db.teacherFeedback
  });

  const sqliteData = loadAllData();
  if (sqliteData.parents.length > 0) {
    db.parents = sqliteData.parents;
    const sarah = sqliteData.parents.find(p => p.email === "sarah.m@kidstech.demo");
    db.parent = sarah || sqliteData.parents[0];
  }
  if (sqliteData.children.length > 0) {
    db.children = sqliteData.children;
  }
  if (sqliteData.sessions.length > 0) {
    db.sessions = sqliteData.sessions;
  }
  if (sqliteData.users.length > 0) {
    db.users = sqliteData.users;
  }
  if (sqliteData.teacherVerifications.length > 0) {
    db.teacherVerifications = sqliteData.teacherVerifications;
  }
  if (sqliteData.payments.length > 0) {
    db.payments = sqliteData.payments;
  }
  if (sqliteData.moderationItems.length > 0) {
    db.moderationItems = sqliteData.moderationItems;
  }
  if (sqliteData.auditLogs.length > 0) {
    db.auditLogs = sqliteData.auditLogs;
  }
  if (Object.keys(sqliteData.parentControls).length > 0) {
    db.parentControls = sqliteData.parentControls;
  }
  if (sqliteData.teacherFeedback.length > 0) {
    db.teacherFeedback = sqliteData.teacherFeedback;
  }
  db.pendingVerifications = sqliteData.pendingVerifications;
  console.log(`[SQLite] Loaded ${db.children.length} children, ${db.sessions.length} sessions, and ${db.users.length} users from kidstech.db`);
} catch (err) {
  console.warn("[SQLite] Database initialization warning:", err.message);
}

export {
  persistParent,
  persistChild,
  deleteChildFromSqlite,
  persistSession,
  persistPendingVerification,
  removePendingVerification,
  purgeCOPPAData,
  persistUser,
  deleteUserFromSqlite,
  persistTeacherVerification,
  persistPayment,
  persistModerationItem,
  persistAuditLog,
  persistParentControls,
  persistTeacherFeedback
};

