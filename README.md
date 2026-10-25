# KIDSTECH — Parent Study Assistant & AI Homework Bridge Platform

> **KIDSTECH** is an AI-powered K–12 educational platform that bridges the gap between student homework, classroom pedagogy, and parent insight. It talks to students like an encouraging, patient teacher while giving parents plain-English diagnostic breakdowns aligned to Common Core State Standards (CCSS) and Next Generation Science Standards (NGSS).

---

## 🌟 Key Features

### 🎓 1. Kid Mode & Bridge Canvas
- **Child Profile Switcher**: Switch between children (e.g., Emma in Grade 3, Noah in Grade 7, Leo in Grade 1).
- **Mascot Avatars**: COPPA-compliant avatar presets (Cozy Bear 🐻, Clever Fox 🦊, Brave Lion 🦁, etc.) with zero facial photo collection.
- **Accommodations Engine**:
  - Dyslexia-friendly line spacing & font layout
  - Patience mode (slower TTS cadence & warmer scaffolding)
  - Socratic Hints Only mode (scaffolding questions before revealing answers)

### 🎒 2. Homework Intake & AI Teacher Engine
- **Multi-Document Upload**: Support for worksheet photos (PNG, JPG, PDF) with drag-and-drop queue.
- **Teacher Instruction Notes**: Custom cues (e.g., *"Explain with tens blocks"*, *"Step-by-step only"*, *"Check my work"*).
- **Grade-Calibrated AI Tutor**: Step-by-step interactive walkthroughs, visual place-value tips, and encouraging notes.
- **Explain Differently**: One-click alternate visualization (e.g., vertical stacking ↔ open number line jumps or real-world analogies).
- **Audio Read-Aloud (TTS)**: Built-in speech synthesis with adjustable rate and pitch calibrated for early elementary readers.

### 🎯 3. Interactive Practice Mode
- **Adaptive Questions**: Subject-calibrated practice for Math, Science, and Reading with real-time feedback.
- **Audio "Listen" Feature**: Kids can tap to hear questions read out loud.
- **Celebration Confetti**: Physics-based canvas confetti animations upon completing questions and rounds.
- **Progress Tracking**: Real-time score counter and progress bar.

### 📄 4. Multi-Subject Printable Worksheet Generator
- **Clean PDF-Ready Worksheets**: Print-optimized paper documents with student name, date, instructions, and workspace.
- **Subjects Supported**:
  - **Math**: Vertical stacked addition/subtraction problems with regrouping roof carry boxes.
  - **Science**: Organelle matching table, diagram questions, and lined written-response prompts.
  - **Reading & Writing**: Excerpt passage with deep comprehension questions and ruled lines.
- **Regenerate Numbers**: One-click regeneration of math problem sets for endless practice.
- **Teacher Answer Key**: Toggleable answer key with full explanations.

### 🛡️ 5. Parent Dashboard & Guardian Oversight
- **Guardian PIN Gate**: 4-digit PIN security gate (Default Demo PIN: `1234`) preventing kids from accessing parent financial or settings views.
- **Struggle-Area Diagnosis**: Plain-English reports on observed strengths, misconception points, and specific "How to Help at Home" conversation starters.
- **Curriculum Standards Benchmarking**: Progress tracking mapped to Common Core (Math/ELA) and NGSS (Science).
- **COPPA Right-to-be-Forgotten**: Self-serve data purge tool that irreversibly erases student uploads, OCR text, and AI diagnostic records upon confirmation.
- **Subscription Management**: Transparent billing pass management (3-month, 6-month, 12-month) and PDF receipts.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti, Web Speech API |
| **Backend API** | Node.js, Express, Multer (file handling), UUID |
| **AI & Standards** | AI Teacher Agent, Curriculum Standards Catalog (CCSS / NGSS / TEKS / C3) |
| **Compliance** | FTC COPPA Safe-Harbor alignment, Verifiable Parental Consent (VPC) design |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v18+ installed

### 1. Start the Backend API Server
```bash
cd server
node server.js
```
The Express REST API will start on `http://localhost:5000`.

To run backend automated verification tests:
```bash
node server/test.js
```

### 2. Start the Frontend Client
```bash
cd client
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
cd client
npm run build
```

---

## 🔑 Demo Credentials

- **Guardian Account**: Sarah Miller (`sarah.m@kidstech.demo`)
- **Default Guardian Security PIN**: `1234`
- **Preloaded Children**:
  - **Emma** (Grade 3 Math • Quest Track • Dyslexia & Patience accommodations)
  - **Noah** (Grade 7 Science • STEM Track • Socratic Hints Only)
  - **Leo** (Grade 1 Phonics • Junior Track • Audio Pacing)
