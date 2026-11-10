// sqliteDb.js - High-performance Native SQLite Persistence using Node.js built-in DatabaseSync
import { DatabaseSync } from "node:sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "kidstech.db");

let dbInstance = null;

export function getDatabase() {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_PATH);
    try {
      dbInstance.exec(`
        PRAGMA journal_mode = WAL;
        PRAGMA busy_timeout = 5000;
        PRAGMA synchronous = NORMAL;
      `);
    } catch (e) {
      console.warn("[SQLite] WAL pragma notice:", e.message);
    }
    initSchema(dbInstance);
  }
  return dbInstance;
}

function initSchema(db) {
  // 1. Parents Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS parents (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT,
      pin TEXT DEFAULT '1234',
      email_verified INTEGER DEFAULT 1,
      provider TEXT DEFAULT 'email',
      created_date TEXT,
      subscription_json TEXT
    );
  `);

  // 2. Children Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS children (
      id TEXT PRIMARY KEY,
      parent_id TEXT NOT NULL,
      name TEXT NOT NULL,
      grade INTEGER NOT NULL,
      avatar TEXT NOT NULL,
      mascot TEXT,
      track TEXT,
      weekly_sessions INTEGER DEFAULT 0,
      streak INTEGER DEFAULT 1,
      autonomy_score INTEGER DEFAULT 85,
      active_focus TEXT,
      accommodations_json TEXT,
      created_date TEXT
    );
  `);

  // 3. Homework Sessions Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      child_name TEXT NOT NULL,
      parent_id TEXT NOT NULL,
      grade INTEGER NOT NULL,
      subject TEXT NOT NULL,
      topic TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      standard_json TEXT,
      child_explanation_json TEXT,
      parent_summary_json TEXT,
      practice_questions_json TEXT,
      teacher_instruction_note TEXT,
      file_url TEXT,
      file_urls_json TEXT
    );
  `);

  // 4. Pending Verifications Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS pending_verifications (
      email TEXT PRIMARY KEY,
      name TEXT,
      password TEXT,
      pin TEXT,
      code TEXT,
      created_at INTEGER
    );
  `);

  // 5. Unified Users Table (Admins, Teachers, Parents, Students)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT,
      role TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      pin TEXT DEFAULT '1234',
      school TEXT,
      subject TEXT,
      grade INTEGER,
      parent_name TEXT,
      avatar TEXT,
      created_date TEXT,
      login_history_json TEXT
    );
  `);

  // 6. Teacher Verifications Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS teacher_verifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      school TEXT NOT NULL,
      license_number TEXT NOT NULL,
      subject TEXT NOT NULL,
      status TEXT NOT NULL,
      documents_json TEXT,
      notes TEXT,
      created_date TEXT,
      updated_date TEXT
    );
  `);

  // 7. Payments Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      amount REAL NOT NULL,
      plan_id TEXT NOT NULL,
      plan_name TEXT NOT NULL,
      status TEXT NOT NULL,
      date TEXT NOT NULL,
      invoice_num TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      refund_reason TEXT
    );
  `);

  // 8. Content Moderation Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS moderation_items (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      student_name TEXT NOT NULL,
      subject TEXT NOT NULL,
      content TEXT NOT NULL,
      file_url TEXT,
      flag_reason TEXT,
      safety_score TEXT,
      status TEXT NOT NULL,
      created_date TEXT
    );
  `);

  // 9. Audit Logs Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      actor_name TEXT NOT NULL,
      actor_role TEXT NOT NULL,
      action TEXT NOT NULL,
      target TEXT NOT NULL,
      details TEXT NOT NULL
    );
  `);

  // 10. Parent Controls Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS parent_controls (
      parent_id TEXT PRIMARY KEY,
      require_pin INTEGER DEFAULT 1,
      screen_time_minutes INTEGER DEFAULT 45,
      weekly_goal_sessions INTEGER DEFAULT 4,
      pending_approvals_json TEXT
    );
  `);

  // 11. Teacher Feedback Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS teacher_feedback (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      teacher_name TEXT NOT NULL,
      message TEXT NOT NULL,
      created_date TEXT
    );
  `);
}

/**
 * Loads all persistent data from SQLite
 */
export function loadAllData() {
  const db = getDatabase();

  const parentsRows = db.prepare("SELECT * FROM parents ORDER BY CASE WHEN email = 'sarah.m@kidstech.demo' THEN 0 ELSE 1 END, created_date ASC").all();
  const childrenRows = db.prepare("SELECT * FROM children ORDER BY created_date ASC").all();
  const sessionsRows = db.prepare("SELECT * FROM sessions ORDER BY date DESC, id DESC").all();
  const pendingRows = db.prepare("SELECT * FROM pending_verifications").all();
  const usersRows = db.prepare("SELECT * FROM users ORDER BY created_date ASC").all();
  const teacherVerifRows = db.prepare("SELECT * FROM teacher_verifications ORDER BY created_date DESC").all();
  const paymentsRows = db.prepare("SELECT * FROM payments ORDER BY date DESC").all();
  const moderationRows = db.prepare("SELECT * FROM moderation_items ORDER BY created_date DESC").all();
  const auditRows = db.prepare("SELECT * FROM audit_logs ORDER BY timestamp DESC").all();
  const controlsRows = db.prepare("SELECT * FROM parent_controls").all();
  const feedbackRows = db.prepare("SELECT * FROM teacher_feedback ORDER BY created_date DESC").all();

  const parents = parentsRows.map(row => ({
    id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    pin: row.pin,
    email_verified: Boolean(row.email_verified),
    provider: row.provider,
    created_date: row.created_date,
    subscription: row.subscription_json ? JSON.parse(row.subscription_json) : null
  }));

  const children = childrenRows.map(row => ({
    id: row.id,
    parentId: row.parent_id,
    name: row.name,
    grade: Number(row.grade),
    avatar: row.avatar,
    mascot: row.mascot,
    track: row.track,
    weeklySessions: Number(row.weekly_sessions),
    streak: Number(row.streak),
    autonomyScore: Number(row.autonomy_score),
    activeFocus: row.active_focus,
    accommodations: row.accommodations_json ? JSON.parse(row.accommodations_json) : {},
    created_date: row.created_date
  }));

  const sessions = sessionsRows.map(row => ({
    id: row.id,
    childId: row.child_id,
    childName: row.child_name,
    parentId: row.parent_id,
    grade: Number(row.grade),
    subject: row.subject,
    topic: row.topic,
    date: row.date,
    status: row.status,
    standard: row.standard_json ? JSON.parse(row.standard_json) : null,
    childExplanation: row.child_explanation_json ? JSON.parse(row.child_explanation_json) : null,
    parentSummary: row.parent_summary_json ? JSON.parse(row.parent_summary_json) : null,
    practiceQuestions: row.practice_questions_json ? JSON.parse(row.practice_questions_json) : [],
    teacherInstructionNote: row.teacher_instruction_note,
    fileUrl: row.file_url,
    fileUrls: row.file_urls_json ? JSON.parse(row.file_urls_json) : (row.file_url ? [row.file_url] : [])
  }));

  const pendingVerifications = {};
  for (const row of pendingRows) {
    pendingVerifications[row.email] = {
      name: row.name,
      email: row.email,
      password: row.password,
      pin: row.pin,
      code: row.code,
      created_at: Number(row.created_at)
    };
  }

  const users = usersRows.map(row => ({
    id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    role: row.role,
    status: row.status,
    pin: row.pin,
    school: row.school,
    subject: row.subject,
    grade: row.grade ? Number(row.grade) : null,
    parent_name: row.parent_name,
    avatar: row.avatar,
    created_date: row.created_date,
    login_history: row.login_history_json ? JSON.parse(row.login_history_json) : []
  }));

  const teacherVerifications = teacherVerifRows.map(row => ({
    id: row.id,
    userId: row.user_id,
    name: row.name,
    email: row.email,
    school: row.school,
    licenseNumber: row.license_number,
    subject: row.subject,
    status: row.status,
    documents: row.documents_json ? JSON.parse(row.documents_json) : [],
    notes: row.notes,
    created_date: row.created_date,
    updated_date: row.updated_date
  }));

  const payments = paymentsRows.map(row => ({
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    amount: Number(row.amount),
    planId: row.plan_id,
    planName: row.plan_name,
    status: row.status,
    date: row.date,
    invoiceNum: row.invoice_num,
    paymentMethod: row.payment_method,
    refundReason: row.refund_reason
  }));

  const moderationItems = moderationRows.map(row => ({
    id: row.id,
    type: row.type,
    studentName: row.student_name,
    subject: row.subject,
    content: row.content,
    fileUrl: row.file_url,
    flagReason: row.flag_reason,
    safetyScore: row.safety_score,
    status: row.status,
    created_date: row.created_date
  }));

  const auditLogs = auditRows.map(row => ({
    id: row.id,
    timestamp: row.timestamp,
    actorName: row.actor_name,
    actorRole: row.actor_role,
    action: row.action,
    target: row.target,
    details: row.details
  }));

  const parentControls = {};
  for (const row of controlsRows) {
    parentControls[row.parent_id] = {
      parentId: row.parent_id,
      requirePin: Boolean(row.require_pin),
      screenTimeMinutes: Number(row.screen_time_minutes),
      weeklyGoalSessions: Number(row.weekly_goal_sessions),
      pendingApprovals: row.pending_approvals_json ? JSON.parse(row.pending_approvals_json) : []
    };
  }

  const teacherFeedback = feedbackRows.map(row => ({
    id: row.id,
    sessionId: row.session_id,
    studentId: row.student_id,
    teacherName: row.teacher_name,
    message: row.message,
    created_date: row.created_date
  }));

  return {
    parents,
    children,
    sessions,
    pendingVerifications,
    users,
    teacherVerifications,
    payments,
    moderationItems,
    auditLogs,
    parentControls,
    teacherFeedback
  };
}

/**
 * Seed initial records into SQLite if tables are completely empty
 */
export function seedDefaultDataIfEmpty({
  initialParents,
  initialChildren,
  initialSessions,
  initialUsers = [],
  initialTeacherVerifications = [],
  initialPayments = [],
  initialModerationItems = [],
  initialAuditLogs = [],
  initialParentControls = {},
  initialTeacherFeedback = []
}) {
  const db = getDatabase();
  const countRow = db.prepare("SELECT count(*) as count FROM children").get();

  if (Number(countRow.count) === 0) {
    console.log("[SQLite] Fresh database detected. Seeding initial student profiles and sessions into kidstech.db...");

    for (const p of initialParents) {
      persistParent(p);
    }
    for (const c of initialChildren) {
      persistChild(c);
    }
    for (const s of initialSessions) {
      persistSession(s);
    }
    console.log("[SQLite] Default seed data committed successfully!");
  }

  // Seed users if empty
  const userCount = db.prepare("SELECT count(*) as count FROM users").get();
  if (Number(userCount.count) === 0 && initialUsers.length > 0) {
    for (const u of initialUsers) {
      persistUser(u);
    }
  }

  // Seed teacher verifications if empty
  const tvCount = db.prepare("SELECT count(*) as count FROM teacher_verifications").get();
  if (Number(tvCount.count) === 0 && initialTeacherVerifications.length > 0) {
    for (const tv of initialTeacherVerifications) {
      persistTeacherVerification(tv);
    }
  }

  // Seed payments if empty
  const payCount = db.prepare("SELECT count(*) as count FROM payments").get();
  if (Number(payCount.count) === 0 && initialPayments.length > 0) {
    for (const pay of initialPayments) {
      persistPayment(pay);
    }
  }

  // Seed moderation items if empty
  const modCount = db.prepare("SELECT count(*) as count FROM moderation_items").get();
  if (Number(modCount.count) === 0 && initialModerationItems.length > 0) {
    for (const item of initialModerationItems) {
      persistModerationItem(item);
    }
  }

  // Seed audit logs if empty
  const logCount = db.prepare("SELECT count(*) as count FROM audit_logs").get();
  if (Number(logCount.count) === 0 && initialAuditLogs.length > 0) {
    for (const log of initialAuditLogs) {
      persistAuditLog(log);
    }
  }

  // Seed parent controls if empty
  const pcCount = db.prepare("SELECT count(*) as count FROM parent_controls").get();
  if (Number(pcCount.count) === 0 && Object.keys(initialParentControls).length > 0) {
    for (const pId of Object.keys(initialParentControls)) {
      persistParentControls(initialParentControls[pId]);
    }
  }

  // Seed teacher feedback if empty
  const tfCount = db.prepare("SELECT count(*) as count FROM teacher_feedback").get();
  if (Number(tfCount.count) === 0 && initialTeacherFeedback.length > 0) {
    for (const fb of initialTeacherFeedback) {
      persistTeacherFeedback(fb);
    }
  }
}

/**
 * Persist Parent profile
 */
export function persistParent(parent) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO parents (
      id, name, email, password, pin, email_verified, provider, created_date, subscription_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    parent.id,
    parent.name,
    parent.email.toLowerCase().trim(),
    parent.password || "password123",
    parent.pin || "1234",
    parent.email_verified ? 1 : 0,
    parent.provider || "email",
    parent.created_date || new Date().toISOString(),
    parent.subscription ? JSON.stringify(parent.subscription) : null
  );
}

/**
 * Persist Child Profile
 */
export function persistChild(child) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO children (
      id, parent_id, name, grade, avatar, mascot, track,
      weekly_sessions, streak, autonomy_score, active_focus,
      accommodations_json, created_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    child.id,
    child.parentId || "parent-sarah-101",
    child.name,
    child.grade,
    child.avatar,
    child.mascot || "",
    child.track || `Grade ${child.grade} Track`,
    child.weeklySessions || 0,
    child.streak || 1,
    child.autonomyScore || 85,
    child.activeFocus || "",
    child.accommodations ? JSON.stringify(child.accommodations) : "{}",
    child.created_date || new Date().toISOString()
  );
}

/**
 * Delete Child Profile and their Sessions
 */
export function deleteChildFromSqlite(childId) {
  const db = getDatabase();
  db.prepare("DELETE FROM children WHERE id = ?").run(childId);
  db.prepare("DELETE FROM sessions WHERE child_id = ?").run(childId);
}

/**
 * Persist Session
 */
export function persistSession(session) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO sessions (
      id, child_id, child_name, parent_id, grade, subject, topic, date, status,
      standard_json, child_explanation_json, parent_summary_json,
      practice_questions_json, teacher_instruction_note, file_url, file_urls_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    session.id,
    session.childId,
    session.childName,
    session.parentId || "parent-sarah-101",
    session.grade,
    session.subject,
    session.topic,
    session.date,
    session.status,
    session.standard ? JSON.stringify(session.standard) : null,
    session.childExplanation ? JSON.stringify(session.childExplanation) : null,
    session.parentSummary ? JSON.stringify(session.parentSummary) : null,
    session.practiceQuestions ? JSON.stringify(session.practiceQuestions) : "[]",
    session.teacherInstructionNote || "",
    session.fileUrl || "",
    session.fileUrls ? JSON.stringify(session.fileUrls) : "[]"
  );
}

/**
 * Persist Pending Verification
 */
export function persistPendingVerification(email, data) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO pending_verifications (
      email, name, password, pin, code, created_at
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    email.toLowerCase().trim(),
    data.name,
    data.password || "",
    data.pin || "1234",
    data.code || "123456",
    data.created_at || Date.now()
  );
}

/**
 * Remove Pending Verification
 */
export function removePendingVerification(email) {
  const db = getDatabase();
  db.prepare("DELETE FROM pending_verifications WHERE email = ?").run(email.toLowerCase().trim());
}

/**
 * Purge COPPA Data (all homework sessions and records)
 */
export function purgeCOPPAData() {
  const db = getDatabase();
  db.exec("DELETE FROM sessions;");
}

/**
 * Persist User
 */
export function persistUser(user) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO users (
      id, name, email, password, role, status, pin, school, subject, grade, parent_name, avatar, created_date, login_history_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    user.id,
    user.name,
    user.email.toLowerCase().trim(),
    user.password || "password123",
    user.role || "student",
    user.status || "active",
    user.pin || "1234",
    user.school || "",
    user.subject || "",
    user.grade || null,
    user.parent_name || "",
    user.avatar || "",
    user.created_date || new Date().toISOString(),
    user.login_history ? JSON.stringify(user.login_history) : "[]"
  );
}

/**
 * Delete User
 */
export function deleteUserFromSqlite(userId) {
  const db = getDatabase();
  db.prepare("DELETE FROM users WHERE id = ?").run(userId);
}

/**
 * Persist Teacher Verification
 */
export function persistTeacherVerification(item) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO teacher_verifications (
      id, user_id, name, email, school, license_number, subject, status, documents_json, notes, created_date, updated_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    item.id,
    item.userId,
    item.name,
    item.email.toLowerCase().trim(),
    item.school,
    item.licenseNumber,
    item.subject,
    item.status,
    item.documents ? JSON.stringify(item.documents) : "[]",
    item.notes || "",
    item.created_date || new Date().toISOString(),
    item.updated_date || new Date().toISOString()
  );
}

/**
 * Persist Payment
 */
export function persistPayment(item) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO payments (
      id, user_id, user_name, amount, plan_id, plan_name, status, date, invoice_num, payment_method, refund_reason
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    item.id,
    item.userId,
    item.userName,
    item.amount,
    item.planId,
    item.planName,
    item.status,
    item.date,
    item.invoiceNum,
    item.paymentMethod,
    item.refundReason || null
  );
}

/**
 * Persist Moderation Item
 */
export function persistModerationItem(item) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO moderation_items (
      id, type, student_name, subject, content, file_url, flag_reason, safety_score, status, created_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    item.id,
    item.type,
    item.studentName,
    item.subject,
    item.content,
    item.fileUrl || "",
    item.flagReason || "",
    item.safetyScore || "100%",
    item.status,
    item.created_date || new Date().toISOString()
  );
}

/**
 * Persist Audit Log
 */
export function persistAuditLog(log) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO audit_logs (
      id, timestamp, actor_name, actor_role, action, target, details
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    log.id,
    log.timestamp || new Date().toISOString(),
    log.actorName,
    log.actorRole,
    log.action,
    log.target,
    log.details
  );
}

/**
 * Persist Parent Controls
 */
export function persistParentControls(ctrl) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO parent_controls (
      parent_id, require_pin, screen_time_minutes, weekly_goal_sessions, pending_approvals_json
    ) VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(
    ctrl.parentId,
    ctrl.requirePin ? 1 : 0,
    ctrl.screenTimeMinutes || 45,
    ctrl.weeklyGoalSessions || 4,
    ctrl.pendingApprovals ? JSON.stringify(ctrl.pendingApprovals) : "[]"
  );
}

/**
 * Persist Teacher Feedback
 */
export function persistTeacherFeedback(item) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO teacher_feedback (
      id, session_id, student_id, teacher_name, message, created_date
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    item.id,
    item.sessionId,
    item.studentId,
    item.teacherName,
    item.message,
    item.created_date || new Date().toISOString()
  );
}
