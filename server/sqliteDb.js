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

  return { parents, children, sessions, pendingVerifications };
}

/**
 * Seed initial records into SQLite if tables are completely empty
 */
export function seedDefaultDataIfEmpty({ initialParents, initialChildren, initialSessions }) {
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
