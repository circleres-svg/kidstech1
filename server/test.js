// test.js - Automated verification of backend logic
import { generateExplanation } from "./aiTeacherAgent.js";
import { lookupStandard } from "./standardsEngine.js";
import { db } from "./db.js";

console.log("=== Testing KIDSTECH Backend Modules ===");

// Test 1: Standards Lookup
const mathStd = lookupStandard("Math", 3, "addition with regrouping");
console.log("✓ Math Standard:", mathStd.code, "-", mathStd.title);
if (!mathStd.code.includes("3.NBT")) {
  throw new Error("Failed Math standard lookup!");
}

const sciStd = lookupStandard("Science", 7, "cell organelles");
console.log("✓ Science Standard:", sciStd.code, "-", sciStd.title);
if (!sciStd.code.includes("MS-LS1")) {
  throw new Error("Failed Science standard lookup!");
}

// Test 2: AI Teacher Agent
const explanation = generateExplanation({
  grade: 3,
  subject: "Math",
  prompt: "28 + 19 with regrouping",
  childName: "Emma",
  teacherInstruction: "explain with tens blocks"
});

console.log("✓ AI Summary:", explanation.childExplanation.assignmentSummary);
console.log("✓ Walkthrough Steps Count:", explanation.childExplanation.steps.length);
console.log("✓ Final Answers:", explanation.childExplanation.finalAnswers.length);
console.log("✓ Parent Summary Standard:", explanation.parentSummary.standardAlignmentNotes);

if (explanation.childExplanation.steps.length < 2) {
  throw new Error("Walkthrough steps too short!");
}

// Test 3: DB and Children (SQLite Backed)
console.log("✓ Pre-seeded Children:", db.children.map(c => c.name).join(", "));
console.log("✓ Pre-seeded Sessions:", db.sessions.length);
if (db.children.length < 3) {
  throw new Error("Children list incomplete!");
}

// Test 4: Gemini Service Multimodal Fallback
import { getGeminiStatus, analyzeHomeworkWithGemini } from "./geminiService.js";
const aiStatus = getGeminiStatus();
console.log("✓ Multimodal AI Status:", aiStatus.model, "| Multimodal enabled:", aiStatus.multimodal);

const asyncResult = await analyzeHomeworkWithGemini({
  grade: 3,
  subject: "Math",
  prompt: "35 + 28 regrouping",
  childName: "Emma"
});
console.log("✓ AI Homework Analysis Result Topic:", asyncResult.topic);
if (!asyncResult.childExplanation || !asyncResult.parentSummary) {
  throw new Error("AI analysis response structure incomplete!");
}

console.log("=== All Backend Unit Tests Passed Successfully! ===");

