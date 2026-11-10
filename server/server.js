// server.js - KIDSTECH Express REST API Server
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import {
  db,
  AVATAR_PRESETS,
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
} from "./db.js";
import { generateExplanation } from "./aiTeacherAgent.js";
import { analyzeHomeworkWithGemini, getGeminiStatus, setGeminiApiKey } from "./geminiService.js";
import { STANDARDS_CATALOG, lookupStandard } from "./standardsEngine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Setup uploads directory
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage for homework files (JPG, PNG, PDF)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });
app.use("/uploads", express.static(uploadsDir));

// ==========================================
// 0. AI Teacher & Multimodal Agent Config
// ==========================================

app.get("/api/ai/config", (req, res) => {
  res.json({ success: true, ...getGeminiStatus() });
});

app.post("/api/ai/config", (req, res) => {
  const { apiKey } = req.body;
  if (typeof apiKey === "string") {
    setGeminiApiKey(apiKey);
    return res.json({ success: true, message: "Gemini API key updated", ...getGeminiStatus() });
  }
  res.status(400).json({ success: false, message: "apiKey string is required." });
});

// ==========================================
// 1. Auth & Multi-Role Account Endpoints (Student, Parent, Teacher, Admin)
// ==========================================

app.get("/api/auth/profile", (req, res) => {
  res.json({ success: true, parent: db.parent, users: db.users });
});

// Unified Login supporting Student, Parent, Teacher, Admin
app.post("/api/auth/login", (req, res) => {
  const { email, password, provider, name, avatar, role } = req.body;
  const targetEmail = (email || "").toLowerCase().trim();

  // Social OAuth (Google / Apple)
  if (provider === "google" || provider === "apple") {
    let parent = db.parents.find(p => p.email === targetEmail);
    if (!parent) {
      parent = {
        id: `parent-${Date.now()}`,
        name: name || (provider === "google" ? "Google Guardian" : "Apple Guardian"),
        email: targetEmail || `${provider}.parent@kidstech.demo`,
        email_verified: true,
        pin: "1234",
        provider,
        created_date: new Date().toISOString(),
        subscription: db.parents[0]?.subscription || {
          status: "active",
          planId: "12mo",
          planName: "12 Months Annual (Best Value)",
          pricePerMonth: "$8.99",
          totalBilled: "$107.88 / year",
          startDate: new Date().toISOString().split("T")[0],
          renewalDate: "2027-08-15",
          cancelAtPeriodEnd: false,
          paymentMethod: { brand: provider === "apple" ? "Apple Pay" : "Google Pay", last4: "8888", exp: "12/28" }
        }
      };
      db.parents.push(parent);
    }
    db.parent = parent;
    persistParent(parent);

    const userObj = {
      id: parent.id,
      name: parent.name,
      email: parent.email,
      role: "parent",
      status: "active",
      pin: parent.pin || "1234",
      avatar: "bear"
    };

    return res.json({
      success: true,
      message: `Signed in with ${provider === "google" ? "Google" : "Apple ID"} successfully!`,
      parent: db.parent,
      user: userObj,
      token: `oauth-token-${parent.id}`
    });
  }

  // 1. Search in unified db.users
  let matchedUser = db.users.find(u => u.email.toLowerCase() === targetEmail);

  // If not found by exact email, check if role was specified for demo one-click login
  if (!matchedUser && role) {
    matchedUser = db.users.find(u => u.role === role);
  }

  if (matchedUser) {
    // Add login history record
    if (!matchedUser.login_history) matchedUser.login_history = [];
    matchedUser.login_history.unshift({
      ip: "127.0.0.1",
      time: new Date().toISOString(),
      device: "Web Browser",
      status: "Success"
    });
    persistUser(matchedUser);

    // If parent, sync with db.parent
    if (matchedUser.role === "parent") {
      const p = db.parents.find(p => p.email.toLowerCase() === matchedUser.email.toLowerCase());
      if (p) db.parent = p;
    }

    // Record audit log
    const auditItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: matchedUser.name,
      actorRole: matchedUser.role,
      action: "USER_LOGIN",
      target: matchedUser.email,
      details: `Successful login as ${matchedUser.role.toUpperCase()}`
    };
    db.auditLogs.unshift(auditItem);
    persistAuditLog(auditItem);

    return res.json({
      success: true,
      message: `Welcome back, ${matchedUser.name}!`,
      user: matchedUser,
      parent: db.parent,
      token: `token-${matchedUser.id}`
    });
  }

  // Fallback: create dynamic user for testing
  const fallbackRole = role || "parent";
  const generatedName = targetEmail.includes("@")
    ? targetEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, l => l.toUpperCase())
    : "Verified User";

  const newUser = {
    id: `usr-${Date.now()}`,
    name: name || generatedName,
    email: targetEmail || `user-${Date.now()}@kidstech.demo`,
    password: password || "password123",
    role: fallbackRole,
    status: "active",
    pin: "1234",
    school: fallbackRole === "teacher" ? "Central Academy" : "",
    subject: fallbackRole === "teacher" ? "General Studies" : "",
    grade: fallbackRole === "student" ? 3 : null,
    avatar: fallbackRole === "student" ? "bear" : "owl",
    created_date: new Date().toISOString(),
    login_history: [{ ip: "127.0.0.1", time: new Date().toISOString(), device: "Web Browser", status: "Success" }]
  };

  db.users.push(newUser);
  persistUser(newUser);

  if (fallbackRole === "parent") {
    const newParent = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      pin: "1234",
      email_verified: true,
      created_date: newUser.created_date,
      subscription: db.parents[0]?.subscription
    };
    db.parents.push(newParent);
    db.parent = newParent;
    persistParent(newParent);
  }

  return res.json({
    success: true,
    message: "Authenticated successfully",
    user: newUser,
    parent: db.parent,
    token: `token-${newUser.id}`
  });
});

// Sign Up with Role Selection (Student, Parent, Teacher, Admin)
app.post("/api/auth/signup", (req, res) => {
  const { name, email, password, pin, role = "parent", school, subject, grade, provider } = req.body;
  if (!email || !name) {
    return res.status(400).json({ success: false, message: "Name and email are required." });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = db.users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (existingUser) {
    return res.status(400).json({ success: false, message: "An account with this email already exists. Please log in." });
  }

  const userRole = ["student", "parent", "teacher", "admin"].includes(role) ? role : "parent";
  const userId = `usr-${Date.now()}`;
  const newUser = {
    id: userId,
    name,
    email: normalizedEmail,
    password: password || "password123",
    role: userRole,
    status: userRole === "teacher" ? "pending_verification" : "active",
    pin: pin || "1234",
    school: school || (userRole === "teacher" ? "Elementary School" : ""),
    subject: subject || (userRole === "teacher" ? "General Education" : ""),
    grade: grade ? Number(grade) : (userRole === "student" ? 3 : null),
    avatar: userRole === "student" ? "bear" : userRole === "teacher" ? "owl" : "fox",
    created_date: new Date().toISOString(),
    login_history: [{ ip: "127.0.0.1", time: new Date().toISOString(), device: "Web Browser", status: "Account Created" }]
  };

  db.users.push(newUser);
  persistUser(newUser);

  // If Teacher, create pending verification entry
  if (userRole === "teacher") {
    const newVerif = {
      id: `tv-${Date.now()}`,
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      school: newUser.school,
      licenseNumber: `REQ-${Math.floor(10000 + Math.random() * 90000)}`,
      subject: newUser.subject,
      status: "Pending",
      documents: [{ name: "Teacher_Credentials_Uploaded.pdf", size: "1.5 MB", type: "pdf" }],
      notes: "Newly registered teacher. Awaiting admin document validation.",
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString()
    };
    db.teacherVerifications.unshift(newVerif);
    persistTeacherVerification(newVerif);
  }

  // If Parent, also register parent record
  if (userRole === "parent") {
    const newParent = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      pin: newUser.pin,
      email_verified: true,
      provider: provider || "email",
      created_date: newUser.created_date,
      subscription: db.parents[0]?.subscription || {
        status: "active",
        planId: "12mo",
        planName: "12 Months Annual (Best Value)",
        pricePerMonth: "$8.99",
        totalBilled: "$107.88 / year",
        startDate: new Date().toISOString().split("T")[0],
        renewalDate: "2027-08-15",
        cancelAtPeriodEnd: false
      }
    };
    db.parents.push(newParent);
    db.parent = newParent;
    persistParent(newParent);
  }

  // Audit log
  const audit = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorName: name,
    actorRole: userRole,
    action: "USER_SIGNUP",
    target: normalizedEmail,
    details: `New account registered as ${userRole.toUpperCase()}${userRole === "teacher" ? " (Pending verification)" : ""}`
  };
  db.auditLogs.unshift(audit);
  persistAuditLog(audit);

  return res.status(201).json({
    success: true,
    message: `Account created successfully as ${userRole.toUpperCase()}!`,
    user: newUser,
    parent: db.parent,
    token: `token-${newUser.id}`
  });
});

// Verify Email Code
app.post("/api/auth/verify-email", (req, res) => {
  const { email, code } = req.body;
  const normalizedEmail = (email || "").toLowerCase().trim();
  const pending = db.pendingVerifications[normalizedEmail];

  if (!pending && code !== "123456") {
    return res.status(400).json({ success: false, message: "Invalid verification code or expired session." });
  }

  const newParent = {
    id: `parent-${Date.now()}`,
    name: pending ? pending.name : (normalizedEmail.split("@")[0] || "Parent Guardian"),
    email: normalizedEmail,
    password: pending ? pending.password : "password123",
    email_verified: true,
    pin: pending ? pending.pin : "1234",
    provider: "email",
    created_date: new Date().toISOString(),
    subscription: db.parents[0].subscription
  };

  db.parents.push(newParent);
  db.parent = newParent;
  delete db.pendingVerifications[normalizedEmail];
  persistParent(newParent);
  removePendingVerification(normalizedEmail);

  // If this parent doesn't have child profiles yet, link default demo children
  db.children.forEach(c => {
    if (!c.parentId || c.parentId === "parent-sarah-101") {
      c.parentId = newParent.id;
      persistChild(c);
    }
  });

  return res.json({
    success: true,
    message: "Account verified and parental consent confirmed!",
    parent: newParent,
    token: `token-${newParent.id}`
  });
});

app.post("/api/auth/verify-pin", (req, res) => {
  const { pin } = req.body;
  if (pin === db.parent.pin || pin === "1234") {
    return res.json({ success: true, verified: true, message: "PIN verified" });
  }
  return res.status(401).json({ success: false, verified: false, message: "Incorrect PIN. Default demo PIN is 1234." });
});

app.post("/api/auth/reset-pin", (req, res) => {
  const { newPin } = req.body;
  if (newPin && newPin.length === 4) {
    db.parent.pin = newPin;
    persistParent(db.parent);
    return res.json({ success: true, message: "PIN updated successfully", newPin });
  }
  return res.status(400).json({ success: false, message: "PIN must be 4 digits." });
});

app.post("/api/auth/logout", (req, res) => {
  res.json({ success: true, message: "Logged out from server session." });
});

// ==========================================
// 2. Children Management Endpoints
// ==========================================

app.get("/api/children", (req, res) => {
  res.json({
    success: true,
    children: db.children,
    avatarPresets: AVATAR_PRESETS
  });
});

app.post("/api/children", (req, res) => {
  const { name, grade, avatar, track, accommodations } = req.body;
  if (!name || !grade) {
    return res.status(400).json({ success: false, message: "Name and grade are required." });
  }

  const preset = AVATAR_PRESETS.find(a => a.key === avatar) || AVATAR_PRESETS[0];
  const newChild = {
    id: `child-${Date.now()}`,
    parentId: db.parent.id,
    name,
    grade: parseInt(grade),
    avatar: preset.key,
    mascot: `${preset.label} ${preset.emoji}`,
    track: track || `Grade ${grade} Academic Track`,
    weeklySessions: 0,
    streak: 1,
    autonomyScore: 85,
    activeFocus: `Grade ${grade} Foundation Skills`,
    accommodations: accommodations || { dyslexiaFont: false, patienceMode: true, speechSpeed: "normal" },
    created_date: new Date().toISOString()
  };

  db.children.push(newChild);
  persistChild(newChild);
  res.status(201).json({ success: true, message: "Child profile added", child: newChild });
});

app.put("/api/children/:id", (req, res) => {
  const { id } = req.params;
  const index = db.children.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ success: false, message: "Child not found." });

  const current = db.children[index];
  const { name, grade, avatar, accommodations } = req.body;

  let mascot = current.mascot;
  if (avatar) {
    const preset = AVATAR_PRESETS.find(a => a.key === avatar);
    if (preset) mascot = `${preset.label} ${preset.emoji}`;
  }

  db.children[index] = {
    ...current,
    name: name || current.name,
    grade: grade ? parseInt(grade) : current.grade,
    avatar: avatar || current.avatar,
    mascot,
    accommodations: accommodations ? { ...current.accommodations, ...accommodations } : current.accommodations
  };

  persistChild(db.children[index]);
  res.json({ success: true, message: "Child updated", child: db.children[index] });
});

app.delete("/api/children/:id", (req, res) => {
  const { id } = req.params;
  db.children = db.children.filter(c => c.id !== id);
  db.sessions = db.sessions.filter(s => s.childId !== id);
  deleteChildFromSqlite(id);
  res.json({ success: true, message: "Child profile and associated records removed." });
});

// ==========================================
// 3. Homework Sessions & AI Tutor Endpoints
// ==========================================

app.get("/api/sessions", (req, res) => {
  const { childId, subject, status } = req.query;
  let list = [...db.sessions];

  if (childId && childId !== "all") {
    list = list.filter(s => s.childId === childId);
  }
  if (subject && subject !== "all") {
    list = list.filter(s => s.subject.toLowerCase() === subject.toLowerCase());
  }
  if (status && status !== "all") {
    list = list.filter(s => s.status === status);
  }

  res.json({ success: true, count: list.length, sessions: list });
});

app.get("/api/sessions/:id", (req, res) => {
  const session = db.sessions.find(s => s.id === req.params.id);
  if (!session) return res.status(404).json({ success: false, message: "Session not found." });
  res.json({ success: true, session });
});

// Create new Homework Session with AI analysis
app.post("/api/sessions/upload", upload.array("homeworkFiles", 5), async (req, res) => {
  const { childId, subject, prompt, teacherInstruction } = req.body;

  const child = db.children.find(c => c.id === childId) || db.children[0];
  const selectedSubject = subject || "Math";
  const userPrompt = prompt || "Grade 3 multi-digit addition with regrouping";

  let fileUrls = [];
  if (req.files && req.files.length > 0) {
    fileUrls = req.files.map(f => `/uploads/${f.filename}`);
  }
  let fileUrl = fileUrls.length > 0 ? fileUrls[0] : null;

  // Also check if req.body.fileUrls or req.body.attachedImages exists
  if (!fileUrl && req.body.fileUrls) {
    try {
      const parsed = typeof req.body.fileUrls === "string" ? JSON.parse(req.body.fileUrls) : req.body.fileUrls;
      if (Array.isArray(parsed) && parsed.length > 0) {
        fileUrls = parsed;
        fileUrl = parsed[0];
      }
    } catch (e) {
      // ignore json parse error
    }
  }

  if (!fileUrl) {
    fileUrl = "/assets/sample_math_worksheet.png";
    fileUrls = ["/assets/sample_math_worksheet.png"];
  }

  // Generate AI Explanation and Diagnostic Parent Summary via Gemini Multimodal or Calibrated Agent
  const aiResult = await analyzeHomeworkWithGemini({
    grade: child.grade,
    subject: selectedSubject,
    prompt: userPrompt,
    childName: child.name,
    teacherInstruction: teacherInstruction || "",
    fileUrls,
    fileUrl
  });

  const newSession = {
    id: `sess-${Date.now()}`,
    childId: child.id,
    childName: child.name,
    parentId: db.parent.id,
    grade: child.grade,
    subject: selectedSubject,
    topic: aiResult.topic,
    learningObjective: aiResult.learningObjective || "Understand the core concept step-by-step through guided inquiry.",
    keyConcepts: aiResult.keyConcepts || ["Core Concept Recognition", "Step-by-step Strategy"],
    date: new Date().toISOString().split("T")[0],
    status: aiResult.status,
    standard: aiResult.standard,
    childExplanation: aiResult.childExplanation,
    parentSummary: aiResult.parentSummary,
    practiceQuestions: aiResult.practiceQuestions,
    teacherInstructionNote: teacherInstruction || "Standard encouraging explanation",
    fileUrl,
    fileUrls: fileUrls.length > 0 ? fileUrls : [fileUrl],
    parentApproved: false
  };

  db.sessions.unshift(newSession);
  child.weeklySessions += 1;
  child.streak += 1;

  // Persist to SQLite
  persistSession(newSession);
  persistChild(child);

  // Record moderation item
  const modItem = {
    id: `mod-${Date.now()}`,
    type: fileUrls.some(f => f.endsWith(".pdf")) ? "Uploaded PDF" : "Uploaded Image",
    studentName: child.name,
    subject: selectedSubject,
    content: `${userPrompt} (Grade ${child.grade})`,
    fileUrl,
    flagReason: "None - Routine submission",
    safetyScore: "99.8%",
    status: "Approved",
    created_date: new Date().toISOString()
  };
  db.moderationItems.unshift(modItem);
  persistModerationItem(modItem);

  res.status(201).json({
    success: true,
    message: "Homework analyzed and explained by AI teacher",
    session: newSession
  });
});

// Explain Differently (Alternate visual angle / number line / Socratic approach)
app.post("/api/sessions/:id/explain-differently", async (req, res) => {
  const session = db.sessions.find(s => s.id === req.params.id);
  if (!session) return res.status(404).json({ success: false, message: "Session not found." });

  const alternate = await analyzeHomeworkWithGemini({
    grade: session.grade,
    subject: session.subject,
    prompt: session.topic,
    childName: session.childName,
    teacherInstruction: session.teacherInstructionNote,
    alternateMode: true,
    fileUrls: session.fileUrls,
    fileUrl: session.fileUrl
  });

  session.childExplanation = alternate.childExplanation;
  session.parentSummary.standardAlignmentNotes += " (Reviewed alternate explanation format).";
  persistSession(session);

  res.json({
    success: true,
    message: "Alternate explanation generated",
    childExplanation: session.childExplanation
  });
});

// ==========================================
// 4. Standards & Mastery Analytics
// ==========================================

app.get("/api/standards", (req, res) => {
  res.json({ success: true, catalog: STANDARDS_CATALOG });
});

app.get("/api/standards/mastery/:childId", (req, res) => {
  const { childId } = req.params;
  const child = db.children.find(c => c.id === childId) || db.children[0];

  // Provide rich subject mastery metrics
  const masteryData = {
    childName: child.name,
    grade: child.grade,
    overallMastery: 84,
    subjects: [
      { name: "Math", score: 88, benchmark: "Proficient", standard: "CCSS.MATH.CONTENT.3.NBT.A.2", trend: "+6% this month" },
      { name: "Science", score: 79, benchmark: "Approaching", standard: "NGSS.3-LS1-1", trend: "Needs review on organelles" },
      { name: "Reading-Writing", score: 85, benchmark: "Proficient", standard: "CCSS.ELA-LITERACY.RI.3.2", trend: "+4% this month" },
      { name: "Social Studies", score: 92, benchmark: "Advanced", standard: "STATE.SS.3.G.1", trend: "Strong spatial skills" },
      { name: "Languages", score: 80, benchmark: "Proficient", standard: "ACTFL.NM.1", trend: "+10% vocabulary retention" }
    ],
    velocityWeeks: [
      { week: "Week 1", sessions: 2, accuracy: 78 },
      { week: "Week 2", sessions: 3, accuracy: 82 },
      { week: "Week 3", sessions: 4, accuracy: 85 },
      { week: "Week 4", sessions: 5, accuracy: 89 }
    ]
  };

  res.json({ success: true, mastery: masteryData });
});

// ==========================================
// 5. Subscription & Billing Endpoints
// ==========================================

app.get("/api/subscriptions/plans", (req, res) => {
  res.json({
    success: true,
    plans: db.pricingPlans,
    currentSubscription: db.parent.subscription,
    invoices: db.invoices
  });
});

app.post("/api/subscriptions/upgrade", (req, res) => {
  const { planId } = req.body;
  const plan = db.pricingPlans.find(p => p.id === planId) || db.pricingPlans[2];

  db.parent.subscription = {
    status: "active",
    planId: plan.id,
    planName: plan.title,
    pricePerMonth: plan.pricePerMonth,
    totalBilled: plan.billingPeriod,
    startDate: new Date().toISOString().split("T")[0],
    renewalDate: "2027-09-20",
    cancelAtPeriodEnd: false,
    paymentMethod: { brand: "Visa", last4: "4242", exp: "12/29" }
  };

  db.invoices.unshift({
    id: `inv-${Date.now()}`,
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    amount: plan.pricePerMonth,
    plan: plan.title,
    status: "Paid",
    receiptUrl: "#"
  });

  res.json({ success: true, message: `Upgraded to ${plan.title}`, subscription: db.parent.subscription });
});

app.post("/api/subscriptions/cancel", (req, res) => {
  db.parent.subscription.cancelAtPeriodEnd = true;
  res.json({
    success: true,
    message: "Subscription set to cancel at end of current billing period. Access will remain active until renewal date.",
    subscription: db.parent.subscription
  });
});

// ==========================================
// 6. COPPA Privacy & Guardian Data Purge
// ==========================================

app.post("/api/coppa/purge", (req, res) => {
  const { confirmText } = req.body;
  if (confirmText !== "DELETE") {
    return res.status(400).json({ success: false, message: "Type 'DELETE' to confirm COPPA full historical purge." });
  }

  const sessionCount = db.sessions.length;
  // Retain the parent account structure, but wipe all student homework, files, and chat records
  db.sessions = [];
  db.children.forEach(c => {
    c.weeklySessions = 0;
    c.activeFocus = "No active homework history (Data Purged)";
    persistChild(c);
  });
  purgeCOPPAData();

  res.json({
    success: true,
    message: `COPPA Right-To-Be-Forgotten applied. Purged ${sessionCount} homework artifacts, student transcripts, and diagnostic history.`
  });
});

// ==========================================
// 7. Comprehensive Admin Portal Endpoints
// ==========================================

// Dashboard Overview Metrics & Charts
app.get("/api/admin/overview", (req, res) => {
  const totalStudents = db.users.filter(u => u.role === "student").length + db.children.length;
  const totalParents = db.users.filter(u => u.role === "parent").length;
  const totalTeachers = db.users.filter(u => u.role === "teacher").length;
  
  const totalRevenue = db.payments
    .filter(p => p.status === "Succeeded")
    .reduce((sum, p) => sum + p.amount, 0);

  const activeSubscriptions = db.payments.filter(p => p.status === "Succeeded").length;
  const pendingVerifications = db.teacherVerifications.filter(tv => tv.status === "Pending").length;
  const homeworkRequests = db.sessions.length;

  res.json({
    success: true,
    overview: {
      totalStudents,
      totalParents,
      totalTeachers,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      activeSubscriptions,
      pendingVerifications,
      homeworkRequests,
      aiUsageStats: {
        totalTokens: "1.85M",
        accuracyRate: "99.2%",
        avgResponseTimeSec: 1.6,
        dailyQueries: 342,
        activeModels: "Gemini 2.0 Flash Multimodal + Calibrated Socratic Heuristics"
      },
      activity: {
        daily: [
          { label: "Mon", requests: 42, activeUsers: 38, revenue: 320 },
          { label: "Tue", requests: 58, activeUsers: 51, revenue: 410 },
          { label: "Wed", requests: 64, activeUsers: 58, revenue: 480 },
          { label: "Thu", requests: 52, activeUsers: 49, revenue: 390 },
          { label: "Fri", requests: 71, activeUsers: 65, revenue: 560 },
          { label: "Sat", requests: 38, activeUsers: 34, revenue: 290 },
          { label: "Sun", requests: 49, activeUsers: 45, revenue: 380 }
        ],
        weekly: [
          { label: "Week 1", requests: 290, activeUsers: 210, revenue: 2450 },
          { label: "Week 2", requests: 340, activeUsers: 260, revenue: 2890 },
          { label: "Week 3", requests: 380, activeUsers: 295, revenue: 3120 },
          { label: "Week 4", requests: 415, activeUsers: 320, revenue: 3450 }
        ],
        monthly: [
          { label: "July", requests: 850, activeUsers: 540, revenue: 7800 },
          { label: "August", requests: 1240, activeUsers: 890, revenue: 11400 },
          { label: "September", requests: 1680, activeUsers: 1150, revenue: 14200 },
          { label: "October", requests: 1950, activeUsers: 1380, revenue: 15900 }
        ]
      }
    }
  });
});

// User Management: View all users, search, filter
app.get("/api/admin/users", (req, res) => {
  const { role, search, status } = req.query;
  let list = [...db.users];

  if (role && role !== "all") {
    list = list.filter(u => u.role.toLowerCase() === role.toLowerCase());
  }
  if (status && status !== "all") {
    list = list.filter(u => u.status.toLowerCase() === status.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.school && u.school.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, count: list.length, users: list });
});

// User Management: Suspend / Restore user
app.post("/api/admin/users/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'active' | 'suspended'
  const user = db.users.find(u => u.id === id);
  if (!user) return res.status(404).json({ success: false, message: "User not found." });

  user.status = status;
  persistUser(user);

  const audit = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorName: "Admin Console",
    actorRole: "admin",
    action: status === "suspended" ? "USER_SUSPENDED" : "USER_RESTORED",
    target: user.email,
    details: `User status updated to ${status.toUpperCase()}`
  };
  db.auditLogs.unshift(audit);
  persistAuditLog(audit);

  res.json({ success: true, message: `User status set to ${status}.`, user });
});

// User Management: Reset password
app.post("/api/admin/users/:id/reset-password", (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;
  const user = db.users.find(u => u.id === id);
  if (!user) return res.status(404).json({ success: false, message: "User not found." });

  user.password = newPassword || "password123";
  persistUser(user);

  const audit = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorName: "Admin Console",
    actorRole: "admin",
    action: "PASSWORD_RESET",
    target: user.email,
    details: `Password reset successfully by administrator.`
  };
  db.auditLogs.unshift(audit);
  persistAuditLog(audit);

  res.json({ success: true, message: `Password reset successfully for ${user.email}.` });
});

// User Management: Update profile
app.put("/api/admin/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, role, school, subject, pin } = req.body;
  const user = db.users.find(u => u.id === id);
  if (!user) return res.status(404).json({ success: false, message: "User not found." });

  if (name) user.name = name;
  if (email) user.email = email.toLowerCase().trim();
  if (role) user.role = role;
  if (school !== undefined) user.school = school;
  if (subject !== undefined) user.subject = subject;
  if (pin !== undefined) user.pin = pin;

  persistUser(user);

  res.json({ success: true, message: "User profile updated.", user });
});

// User Management: Delete user
app.delete("/api/admin/users/:id", (req, res) => {
  const { id } = req.params;
  const user = db.users.find(u => u.id === id);
  if (!user) return res.status(404).json({ success: false, message: "User not found." });

  db.users = db.users.filter(u => u.id !== id);
  deleteUserFromSqlite(id);

  const audit = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorName: "Admin Console",
    actorRole: "admin",
    action: "USER_DELETED",
    target: user.email,
    details: `User account deleted permanently.`
  };
  db.auditLogs.unshift(audit);
  persistAuditLog(audit);

  res.json({ success: true, message: "User account deleted." });
});

// Teacher Verification: List all teachers & verification requests
app.get("/api/admin/teachers", (req, res) => {
  const { status } = req.query;
  let list = [...db.teacherVerifications];
  if (status && status !== "all") {
    list = list.filter(tv => tv.status.toLowerCase() === status.toLowerCase());
  }
  res.json({ success: true, count: list.length, teachers: list });
});

// Teacher Verification: Approve / Reject / Request Docs
app.post("/api/admin/teachers/:id/verify", (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body; // 'Approved' | 'Rejected' | 'Pending'
  const verif = db.teacherVerifications.find(tv => tv.id === id);
  if (!verif) return res.status(404).json({ success: false, message: "Verification record not found." });

  verif.status = status;
  verif.notes = notes || verif.notes;
  verif.updated_date = new Date().toISOString();
  persistTeacherVerification(verif);

  // Sync user status in db.users
  const user = db.users.find(u => u.id === verif.userId || u.email.toLowerCase() === verif.email.toLowerCase());
  if (user) {
    user.status = status === "Approved" ? "active" : status === "Rejected" ? "suspended" : "pending_verification";
    persistUser(user);
  }

  const audit = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorName: "Admin Eleanor Vance",
    actorRole: "admin",
    action: `TEACHER_${status.toUpperCase()}`,
    target: verif.email,
    details: notes || `Teacher credentials status updated to ${status}.`
  };
  db.auditLogs.unshift(audit);
  persistAuditLog(audit);

  res.json({ success: true, message: `Teacher status set to ${status}.`, verification: verif });
});

// Payment Management: Transactions & Subscriptions
app.get("/api/admin/payments", (req, res) => {
  const { status } = req.query;
  let list = [...db.payments];
  if (status && status !== "all") {
    list = list.filter(p => p.status.toLowerCase() === status.toLowerCase());
  }
  res.json({ success: true, count: list.length, payments: list });
});

// Revenue Reports (Daily, Weekly, Monthly, Annual)
app.get("/api/admin/revenue", (req, res) => {
  const reports = {
    dailyAverage: 425.50,
    weeklyTotal: 2980.00,
    monthlyTotal: 12850.00,
    annualProjected: 154200.00,
    planBreakdown: [
      { plan: "12 Months Family Pass (2 Kids - $12.00/mo with 50% sibling discount)", count: 88, revenue: 12672.00, percentage: "54%" },
      { plan: "12 Months Single Kid ($8.00/mo)", count: 54, revenue: 5184.00, percentage: "22%" },
      { plan: "Multi-Child Pass (3+ Kids - $16.00/mo)", count: 28, revenue: 5376.00, percentage: "14%" },
      { plan: "6 Months Semester Pass (2 Kids - $15.00/mo)", count: 18, revenue: 1620.00, percentage: "10%" }
    ],
    failedTransactionsCount: db.payments.filter(p => p.status === "Failed").length,
    refundsProcessedCount: db.payments.filter(p => p.status === "Refunded").length
  };
  res.json({ success: true, reports });
});

// Refund Management
app.post("/api/admin/refunds/:id", (req, res) => {
  const { id } = req.params;
  const { action, reason } = req.body; // 'approve' | 'deny'
  const payment = db.payments.find(p => p.id === id);
  if (!payment) return res.status(404).json({ success: false, message: "Payment transaction not found." });

  if (action === "approve") {
    payment.status = "Refunded";
    payment.refundReason = reason || "Refund approved by administrator.";
  } else {
    payment.refundReason = `Refund denied: ${reason || "Does not meet terms of service."}`;
  }
  persistPayment(payment);

  const audit = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorName: "Admin Console",
    actorRole: "admin",
    action: action === "approve" ? "REFUND_APPROVED" : "REFUND_DENIED",
    target: payment.invoiceNum,
    details: `${payment.userName} - $${payment.amount}`
  };
  db.auditLogs.unshift(audit);
  persistAuditLog(audit);

  res.json({ success: true, message: `Refund ${action === "approve" ? "approved" : "denied"}.`, payment });
});

// Content Moderation: List submissions
app.get("/api/admin/moderation", (req, res) => {
  const { status } = req.query;
  let list = [...db.moderationItems];
  if (status && status !== "all") {
    list = list.filter(m => m.status.toLowerCase() === status.toLowerCase());
  }
  res.json({ success: true, count: list.length, items: list });
});

// Content Moderation: Flag / Remove / Approve
app.post("/api/admin/moderation/:id/action", (req, res) => {
  const { id } = req.params;
  const { action, reason } = req.body; // 'approve' | 'flag' | 'remove'
  const item = db.moderationItems.find(m => m.id === id);
  if (!item) return res.status(404).json({ success: false, message: "Moderation item not found." });

  if (action === "approve") {
    item.status = "Approved";
  } else if (action === "flag") {
    item.status = "Flagged";
    if (reason) item.flagReason = reason;
  } else if (action === "remove") {
    item.status = "Removed";
    if (reason) item.flagReason = reason;
  }
  persistModerationItem(item);

  const audit = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorName: "Admin Console",
    actorRole: "admin",
    action: `CONTENT_${action.toUpperCase()}`,
    target: item.id,
    details: `${item.studentName} - ${item.subject} (${item.type})`
  };
  db.auditLogs.unshift(audit);
  persistAuditLog(audit);

  res.json({ success: true, message: `Content ${action}d successfully.`, item });
});

// Audit Logs
app.get("/api/admin/audit-logs", (req, res) => {
  res.json({ success: true, count: db.auditLogs.length, logs: db.auditLogs });
});

// Reporting System (Student, Teacher, Parent)
app.get("/api/admin/reports", (req, res) => {
  const studentReports = {
    usageFrequency: {
      dailyActiveStudents: 142,
      weeklyActiveStudents: 520,
      monthlyActiveStudents: 1840,
      avgSessionsPerStudentPerWeek: 3.8
    },
    homeworkTypes: [
      { type: "Math Worksheets", percentage: 48, count: 624 },
      { type: "Science Diagrams & Lab Sheets", percentage: 26, count: 338 },
      { type: "Reading & ELA Passages", percentage: 18, count: 234 },
      { type: "Social Studies & Other", percentage: 8, count: 104 }
    ],
    subjectAnalysis: [
      { subject: "Math", masteryAvg: "84%", avgHintsUsed: 2.1, commonStruggle: "Regrouping tens and uncommon denominators" },
      { subject: "Science", masteryAvg: "88%", avgHintsUsed: 1.4, commonStruggle: "Mitochondria vs Chloroplast energy cycle" },
      { subject: "Reading-Writing", masteryAvg: "91%", avgHintsUsed: 1.1, commonStruggle: "Differentiating main umbrella idea from trivia" }
    ]
  };

  const teacherReports = {
    totalQuestionsReceived: 184,
    totalTeacherResponses: 176,
    avgResponseMinutes: 14.5,
    activityLevel: "95.6%",
    topContributingTeachers: [
      { name: "Mr. Robert Davis", school: "Lincoln Elementary", reviewsGiven: 82, satisfactionRating: "4.9/5" },
      { name: "Ms. Elena Rostova", school: "Westlake STEM Academy", reviewsGiven: 54, satisfactionRating: "4.8/5" },
      { name: "Mr. Thomas Sterling", school: "Oakridge Middle School", reviewsGiven: 40, satisfactionRating: "5.0/5" }
    ]
  };

  const parentReports = {
    averageStudentProgressScore: "+18% mastery over 30 days",
    learningTrends: "Increased independent study sessions; 74% reduction in homework friction",
    subjectStrengths: ["Multi-digit column addition", "Vocabulary context clues", "Cell organelle identification"],
    subjectWeaknesses: ["Subtracting with zeroes across multiple columns", "Fractions with unlike prime denominators"]
  };

  res.json({
    success: true,
    reports: {
      students: studentReports,
      teachers: teacherReports,
      parents: parentReports
    }
  });
});

// ==========================================
// 8. Teacher Dashboard Endpoints
// ==========================================

app.get("/api/teacher/students", (req, res) => {
  // Return students assigned to teachers
  const assigned = db.children.map(c => ({
    id: c.id,
    name: c.name,
    grade: c.grade,
    avatar: c.avatar,
    mascot: c.mascot,
    weeklySessions: c.weeklySessions,
    streak: c.streak,
    autonomyScore: c.autonomyScore,
    activeFocus: c.activeFocus
  }));
  res.json({ success: true, count: assigned.length, students: assigned });
});

app.get("/api/teacher/submissions", (req, res) => {
  // Returns submitted homework sessions
  res.json({ success: true, count: db.sessions.length, submissions: db.sessions });
});

app.post("/api/teacher/feedback", (req, res) => {
  const { sessionId, studentId, teacherName, message } = req.body;
  if (!sessionId || !message) {
    return res.status(400).json({ success: false, message: "Session ID and message are required." });
  }

  const fbItem = {
    id: `tfb-${Date.now()}`,
    sessionId,
    studentId: studentId || "child-1",
    teacherName: teacherName || "Mr. Robert Davis",
    message,
    created_date: new Date().toISOString()
  };

  db.teacherFeedback.unshift(fbItem);
  persistTeacherFeedback(fbItem);

  // Also update session note
  const sess = db.sessions.find(s => s.id === sessionId);
  if (sess) {
    sess.teacherInstructionNote = `Teacher Note: ${message}`;
    persistSession(sess);
  }

  res.status(201).json({ success: true, message: "Feedback delivered to student & parent dashboard.", feedback: fbItem });
});

// ==========================================
// 9. Parent Controls Endpoints
// ==========================================

app.get("/api/parent/controls", (req, res) => {
  const parentId = db.parent.id;
  const controls = db.parentControls[parentId] || {
    parentId,
    requirePin: true,
    screenTimeMinutes: 45,
    weeklyGoalSessions: 4,
    pendingApprovals: []
  };
  res.json({ success: true, controls });
});

app.post("/api/parent/controls", (req, res) => {
  const parentId = db.parent.id;
  const { requirePin, screenTimeMinutes, weeklyGoalSessions, pin } = req.body;

  let controls = db.parentControls[parentId] || {
    parentId,
    requirePin: true,
    screenTimeMinutes: 45,
    weeklyGoalSessions: 4,
    pendingApprovals: []
  };

  if (requirePin !== undefined) controls.requirePin = Boolean(requirePin);
  if (screenTimeMinutes !== undefined) controls.screenTimeMinutes = Number(screenTimeMinutes);
  if (weeklyGoalSessions !== undefined) controls.weeklyGoalSessions = Number(weeklyGoalSessions);

  if (pin && pin.length === 4) {
    db.parent.pin = pin;
    persistParent(db.parent);
  }

  db.parentControls[parentId] = controls;
  persistParentControls(controls);

  res.json({ success: true, message: "Parent controls updated successfully.", controls });
});

app.post("/api/parent/approve-answer", (req, res) => {
  const { sessionId } = req.body;
  const session = db.sessions.find(s => s.id === sessionId);
  if (session) {
    session.parentApproved = true;
    persistSession(session);
  }

  const audit = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorName: db.parent.name,
    actorRole: "parent",
    action: "PARENT_ANSWER_APPROVED",
    target: sessionId,
    details: "Parent granted final answer viewing authorization."
  };
  db.auditLogs.unshift(audit);
  persistAuditLog(audit);

  res.json({ success: true, message: "Final answer approved for student viewing.", sessionId });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", service: "KIDSTECH Parent Study Assistant Platform", version: "1.0.0" });
});

const server = app.listen(PORT, () => {
  console.log(`[KIDSTECH API Server] Running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n❌ [KIDSTECH Server Error] Port ${PORT} is already in use by another running process.`);
    console.error(`👉 Solution: A background server is already active on port ${PORT}.`);
    console.error(`   To kill the existing process on Windows: Get-NetTCPConnection -LocalPort 5000 | Stop-Process -Id {$_.OwningProcess} -Force\n`);
  } else {
    console.error("[KIDSTECH Server Error]:", err);
  }
});
