// geminiService.js - Real-time Multimodal AI Analysis with Google Gemini API
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateExplanation as generateHeuristicExplanation } from "./aiTeacherAgent.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Runtime or Environment API Key
let runtimeApiKey = process.env.GEMINI_API_KEY || "";

export function setGeminiApiKey(key) {
  runtimeApiKey = (key || "").trim();
}

export function getGeminiStatus() {
  return {
    configured: Boolean(runtimeApiKey || process.env.GEMINI_API_KEY),
    model: "gemini-2.0-flash",
    multimodal: true
  };
}

/**
 * Resolves an uploaded or static asset filepath on disk and converts to base64
 */
function resolveImageBase64(fileUrl) {
  if (!fileUrl) return null;
  try {
    let localPath = "";
    if (fileUrl.startsWith("/uploads/")) {
      localPath = path.join(__dirname, "uploads", fileUrl.replace("/uploads/", ""));
    } else if (fileUrl.startsWith("/assets/")) {
      localPath = path.join(__dirname, "..", "client", "public", "assets", fileUrl.replace("/assets/", ""));
    } else if (fs.existsSync(fileUrl)) {
      localPath = fileUrl;
    }

    if (localPath && fs.existsSync(localPath)) {
      const buffer = fs.readFileSync(localPath);
      const ext = path.extname(localPath).toLowerCase().replace(".", "");
      const mimeType = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "application/pdf";
      return {
        mimeType,
        data: buffer.toString("base64")
      };
    }
  } catch (err) {
    console.warn("[Gemini AI] Could not read image file for multimodal prompt:", err.message);
  }
  return null;
}

/**
 * Analyzes homework using Google Gemini 2.0/1.5 Flash multimodal API,
 * with automatic fallback to the calibrated pedagogical engine.
 */
export async function analyzeHomeworkWithGemini({
  grade,
  subject,
  prompt,
  childName,
  teacherInstruction = "",
  alternateMode = false,
  fileUrls = [],
  fileUrl = null
}) {
  const apiKey = runtimeApiKey || process.env.GEMINI_API_KEY;

  // Fallback immediately if no Gemini key is provided
  if (!apiKey) {
    console.log("[AI Teacher] No GEMINI_API_KEY set. Using calibrated pedagogical heuristic engine.");
    return generateHeuristicExplanation({
      grade,
      subject,
      prompt,
      childName,
      teacherInstruction,
      alternateMode
    });
  }

  try {
    console.log(`[Gemini AI] Sending multimodal prompt to Gemini 2.0 Flash for ${childName} (Grade ${grade} ${subject})...`);

    // Prepare contents array
    const parts = [];

    // Attach up to 2 homework images for multimodal inspection
    const targetUrls = fileUrls && fileUrls.length > 0 ? fileUrls : fileUrl ? [fileUrl] : [];
    for (const url of targetUrls.slice(0, 2)) {
      const imgData = resolveImageBase64(url);
      if (imgData) {
        parts.push({
          inline_data: {
            mime_type: imgData.mimeType,
            data: imgData.data
          }
        });
      }
    }

    const systemInstruction = `You are an encouraging, expert K-12 AI Teacher and COPPA-compliant parent study assistant platform called KIDSTECH.
Student: ${childName || "Student"}
Grade Level: Grade ${grade || 3}
Subject: ${subject || "Math"}
Topic/Notes: ${prompt || "Homework problem"}
Teacher Custom Guidance: ${teacherInstruction || "Standard encouraging step-by-step guidance"}
Alternate Mode Requested: ${alternateMode ? "YES (explain using visual open number lines or real-world analogy)" : "NO (standard clear method)"}

CRITICAL INSTRUCTIONS:
1. Talk to the student warmly like a caring, patient classroom teacher.
2. For Math, show place-value columns and regrouping steps clearly.
3. For Science and ELA, break ideas down with memorable visual metaphors.
4. Provide plain-English parent diagnostic breakdown explaining the underlying curriculum standard (CCSS or NGSS), student mastery strengths, and helpful home coaching tips.
5. Provide 3 multiple-choice practice questions with hints and options.
6. RETURN ONLY VALID JSON matching this exact structure:
{
  "topic": "Concise topic title",
  "status": "complete" or "needs_review",
  "standard": {
    "code": "e.g. CCSS.MATH.CONTENT.3.NBT.A.2 or NGSS.MS-LS1-2",
    "title": "Standard name",
    "domain": "Curriculum domain"
  },
  "childExplanation": {
    "assignmentSummary": "Warm friendly 1-2 sentence greeting",
    "steps": [
      {
        "stepNumber": 1,
        "title": "Clear step title",
        "explanation": "Clear step explanation",
        "visualTip": "Helpful visual representation"
      }
    ],
    "finalAnswers": [
      {
        "question": "Problem #1",
        "answer": "Solution",
        "checkExplanation": "How to verify"
      }
    ],
    "encouragingTip": "Encouraging praise note",
    "readAloudScript": "Friendly conversational script for TTS"
  },
  "parentSummary": {
    "conceptTested": "Core conceptual standard tested",
    "childStrengths": "Observed strengths",
    "strugglePoints": "Specific misconception or struggle point",
    "atHomeHelpTips": "Specific questions parents can ask at home",
    "standardAlignmentNotes": "Curriculum benchmark context"
  },
  "practiceQuestions": [
    {
      "id": 1,
      "problem": "Practice problem text",
      "hint": "Gentle Socratic hint",
      "correctAnswer": "Correct Option",
      "options": ["Correct Option", "Distractor 1", "Distractor 2", "Distractor 3"]
    }
  ]
}`;

    parts.push({
      text: systemInstruction
    });

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts
          }
        ],
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.2
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`[Gemini AI] API responded with error ${response.status}: ${errText}. Falling back to heuristic agent.`);
      return generateHeuristicExplanation({ grade, subject, prompt, childName, teacherInstruction, alternateMode });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (rawText) {
      const parsed = JSON.parse(rawText);
      console.log("[Gemini AI] Successfully received and parsed structured response from Gemini!");
      return parsed;
    }
  } catch (err) {
    console.warn("[Gemini AI] Error during Gemini API invocation:", err.message);
  }

  // Graceful fallback
  return generateHeuristicExplanation({
    grade,
    subject,
    prompt,
    childName,
    teacherInstruction,
    alternateMode
  });
}
