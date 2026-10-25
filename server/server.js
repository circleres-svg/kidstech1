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
  purgeCOPPAData
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
// 1. Auth & Guardian Account Endpoints
// ==========================================

app.get("/api/auth/profile", (req, res) => {
  res.json({ success: true, parent: db.parent });
});

// Unified Login (Email/Password, Google OAuth, Apple OAuth)
app.post("/api/auth/login", (req, res) => {
  const { email, password, provider, name, avatar } = req.body;

  // Social OAuth (Google / Apple)
  if (provider === "google" || provider === "apple") {
    let parent = db.parents.find(p => p.email === email);
    if (!parent) {
      parent = {
        id: `parent-${Date.now()}`,
        name: name || (provider === "google" ? "Google Guardian" : "Apple Guardian"),
        email: email || `${provider}.parent@kidstech.demo`,
        email_verified: true,
        pin: "1234",
        provider,
        created_date: new Date().toISOString(),
        subscription: {
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
    return res.json({
      success: true,
      message: `Signed in with ${provider === "google" ? "Google" : "Apple ID"} successfully!`,
      parent: db.parent,
      token: `oauth-token-${parent.id}`
    });
  }

  // Email / Password Login
  const targetEmail = (email || "").toLowerCase().trim();
  let parent = db.parents.find(p => p.email.toLowerCase() === targetEmail);

  if (!parent) {
    // If testing with any valid-looking email or default demo
    if (targetEmail.includes("@")) {
      const generatedName = targetEmail.split("@")[0].replace(/[._-]/g, " ");
      const formattedName = generatedName.charAt(0).toUpperCase() + generatedName.slice(1);
      parent = {
        id: `parent-${Date.now()}`,
        name: formattedName || "Parent Guardian",
        email: targetEmail,
        password: password || "password123",
        email_verified: true,
        pin: "1234",
        provider: "email",
        created_date: new Date().toISOString(),
        subscription: db.parents[0].subscription
      };
      db.parents.push(parent);
    } else {
      parent = db.parents[0];
    }
  }

  db.parent = parent;
  persistParent(parent);
  return res.json({
    success: true,
    message: "Authenticated successfully",
    parent: db.parent,
    token: `token-${parent.id}`
  });
});

// Sign Up / Register Guardian Account
app.post("/api/auth/signup", (req, res) => {
  const { name, email, password, pin, provider } = req.body;
  if (!email || !name) {
    return res.status(400).json({ success: false, message: "Name and email are required." });
  }

  const normalizedEmail = email.toLowerCase().trim();
  
  // Instant verification for OAuth providers
  if (provider === "google" || provider === "apple") {
    const newParent = {
      id: `parent-${Date.now()}`,
      name,
      email: normalizedEmail,
      email_verified: true,
      pin: pin || "1234",
      provider,
      created_date: new Date().toISOString(),
      subscription: db.parents[0].subscription
    };
    db.parents.push(newParent);
    db.parent = newParent;
    persistParent(newParent);
    return res.status(201).json({
      success: true,
      message: `Account created via ${provider === "google" ? "Google" : "Apple ID"}!`,
      parent: newParent,
      token: `oauth-token-${newParent.id}`
    });
  }

  // Standard Email Signup -> Generates COPPA VPC 6-digit confirmation code
  const verificationCode = "123456"; // Standard demo verification code for predictable testability
  const pendingData = {
    name,
    email: normalizedEmail,
    password: password || "password123",
    pin: pin || "1234",
    code: verificationCode,
    created_at: Date.now()
  };
  db.pendingVerifications[normalizedEmail] = pendingData;
  persistPendingVerification(normalizedEmail, pendingData);

  return res.status(201).json({
    success: true,
    verificationRequired: true,
    verificationCode,
    email: normalizedEmail,
    message: "Verification code dispatched! For COPPA compliance, verify your email with the 6-digit code."
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
    date: new Date().toISOString().split("T")[0],
    status: aiResult.status,
    standard: aiResult.standard,
    childExplanation: aiResult.childExplanation,
    parentSummary: aiResult.parentSummary,
    practiceQuestions: aiResult.practiceQuestions,
    teacherInstructionNote: teacherInstruction || "Standard encouraging explanation",
    fileUrl,
    fileUrls: fileUrls.length > 0 ? fileUrls : [fileUrl]
  };

  db.sessions.unshift(newSession);
  child.weeklySessions += 1;
  child.streak += 1;

  // Persist to SQLite
  persistSession(newSession);
  persistChild(child);

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
