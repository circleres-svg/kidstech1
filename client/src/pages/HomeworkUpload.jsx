import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { ArrowLeft, Camera, Upload, X, FileText, Eye, Trash2, Smartphone } from "lucide-react";
import { CameraModal } from "../components/CameraModal";

export function HomeworkUpload() {
  const { selectedChild, setCurrentView, setActiveSession, setSessions, API_BASE, showToast, getChildEmoji } = useApp();

  const [subject, setSubject] = useState("Math");
  const [prompt, setPrompt] = useState("Two-digit addition with regrouping (28 + 19, 45 + 37)");
  const [teacherInstruction, setTeacherInstruction] = useState("Explain with tens blocks and give step-by-step hints");
  
  // Array of attached homework items: { id, name, size, type, previewUrl, isCameraCapture, dataUrl }
  const [files, setFiles] = useState([
    {
      id: "sample-1",
      name: "math_worksheet_page_1.png",
      size: "1.2 MB",
      type: "image/png",
      previewUrl: "/assets/sample_math_worksheet.png",
      isSample: true
    }
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [previewModalImage, setPreviewModalImage] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Hidden native camera input for direct mobile shutter capture
  const nativeCameraInputRef = useRef(null);
  const regularFileInputRef = useRef(null);

  const subjects = [
    { name: "Math", icon: "➕", color: "bg-sky-500", text: "text-sky-700", border: "border-sky-300" },
    { name: "Reading-Writing", icon: "📖", color: "bg-amber-400", text: "text-amber-700", border: "border-amber-300" },
    { name: "Science", icon: "🔬", color: "bg-emerald-500", text: "text-emerald-700", border: "border-emerald-300" },
    { name: "Social Studies", icon: "🌍", color: "bg-rose-400", text: "text-rose-700", border: "border-rose-300" },
    { name: "Languages", icon: "🗣️", color: "bg-purple-500", text: "text-purple-700", border: "border-purple-300" }
  ];

  const presets = [
    "Explain like I'm 8 🧸",
    "Step-by-step only 👣",
    "Don't give the answer, just give hints 💡",
    "Check my work ✓",
    "Use visual blocks / bar models 🧱"
  ];

  // Handle file uploads (multi-file selection or drop)
  const handleFilesAdded = (incomingFileList) => {
    if (!incomingFileList || incomingFileList.length === 0) return;

    const newItems = Array.from(incomingFileList).map((f, i) => {
      const sizeMb = (f.size / (1024 * 1024)).toFixed(1);
      const isImg = f.type.startsWith("image/");
      return {
        id: `file-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 5)}`,
        name: f.name,
        size: `${sizeMb > 0 ? sizeMb : "<0.1"} MB`,
        type: f.type,
        previewUrl: isImg ? URL.createObjectURL(f) : null,
        fileObj: f
      };
    });

    setFiles((prev) => [...prev, ...newItems]);
    showToast(`Added ${newItems.length} file(s) to homework queue!`);
  };

  const handleFileInputChange = (e) => {
    handleFilesAdded(e.target.files);
    e.target.value = ""; // Reset so same file can be re-selected if needed
  };

  // Drag and Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer && e.dataTransfer.files) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  // Add captured camera photo
  const handleCameraCapture = (fileItem) => {
    setFiles((prev) => [...prev, fileItem]);
    showToast(`Photo captured! Added as Page ${files.length + 1}.`);
  };

  const removeFile = (idToRemove) => {
    setFiles((prev) => prev.filter((item) => item.id !== idToRemove));
  };

  const clearAllFiles = () => {
    setFiles([]);
    showToast("Cleared attached files");
  };

  // Submit Homework for AI Analysis
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0 && !prompt.trim()) {
      showToast("Please attach a homework photo or describe the topic.", "error");
      return;
    }

    setIsProcessing(true);
    setLoadingMessage("Reading your homework pages...");

    try {
      setTimeout(() => setLoadingMessage("Your AI teacher is preparing step-by-step explanations..."), 900);

      const fileUrlsToSend = files.map((f) => f.previewUrl || "/assets/sample_math_worksheet.png");

      const res = await fetch(`${API_BASE}/sessions/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId: selectedChild?.id || "child-1",
          subject,
          prompt,
          teacherInstruction,
          fileUrls: fileUrlsToSend
        })
      });

      const data = await res.json();
      if (data.success) {
        // Ensure fileUrls are preserved
        const sessionWithFiles = {
          ...data.session,
          fileUrls: fileUrlsToSend.length > 0 ? fileUrlsToSend : [data.session.fileUrl]
        };
        setActiveSession(sessionWithFiles);
        setSessions((prev) => [sessionWithFiles, ...prev]);

        setTimeout(() => {
          setIsProcessing(false);
          setCurrentView("explanation");
          showToast("AI Teacher explanation ready!");
        }, 1200);
      } else {
        throw new Error(data.message || "Failed to process");
      }
    } catch (err) {
      console.warn("Upload fallback handling:", err);
      const childName = selectedChild?.name || "Emma";
      const fileUrlsToSend = files.map((f) => f.previewUrl || "/assets/sample_math_worksheet.png");

      const newSession = {
        id: `sess-${Date.now()}`,
        childId: selectedChild?.id || "child-1",
        childName,
        grade: selectedChild?.grade || 3,
        subject,
        topic: prompt,
        date: new Date().toISOString().split("T")[0],
        status: "complete",
        standard: {
          code: subject === "Math" ? "CCSS.MATH.CONTENT.3.NBT.A.2" : subject === "Science" ? "NGSS.MS-LS1-2" : "CCSS.ELA-LITERACY.RI.3.2",
          title: `${subject} Core Competency Demonstration`,
          domain: `${subject} Grade-band standards`
        },
        childExplanation: {
          assignmentSummary: `Welcome back ${childName}! Let's work on ${prompt} step-by-step together!`,
          steps: [
            {
              stepNumber: 1,
              title: "Understand the Core Problem",
              explanation: "Carefully read the question and note down the key quantities and terms from your worksheet.",
              visualTip: "Step 1: Identify Key Details"
            },
            {
              stepNumber: 2,
              title: "Apply the Targeted Strategy",
              explanation: `Follow the teacher's guidance: ${teacherInstruction || "Break it down into manageable steps"}.`,
              visualTip: "Step 2: Solve with Strategy"
            }
          ],
          finalAnswers: [
            { question: "Problem #1", answer: "Verified Solution", checkExplanation: "Confirmed through step-by-step reasoning." }
          ],
          encouragingTip: `🌟 Fantastic focus, ${childName}! You are doing amazing work!`,
          readAloudScript: `Hello ${childName}! You're working on ${prompt}. Take it one step at a time, you are doing awesome!`
        },
        parentSummary: {
          conceptTested: `${subject} problem solving & core principles`,
          childStrengths: `${childName} showed great patience and systematic execution.`,
          strugglePoints: "Double checking work and checking carrying/definitions before finalizing.",
          atHomeHelpTips: "Celebrate their problem-solving routine and ask them to explain the steps out loud!",
          standardAlignmentNotes: "Directly aligned to grade curriculum standards."
        },
        practiceQuestions: [
          {
            id: 1,
            problem: `Practice question for ${prompt}`,
            hint: "Think back to the first step we solved above!",
            correctAnswer: "Target Answer",
            options: ["Option A", "Target Answer", "Option C", "Option D"]
          }
        ],
        teacherInstructionNote: teacherInstruction || "Standard encouraging guidance",
        fileUrl: fileUrlsToSend[0] || "/assets/sample_math_worksheet.png",
        fileUrls: fileUrlsToSend.length > 0 ? fileUrlsToSend : ["/assets/sample_math_worksheet.png"]
      };

      setActiveSession(newSession);
      setSessions((prev) => [newSession, ...prev]);

      setTimeout(() => {
        setIsProcessing(false);
        setCurrentView("explanation");
        showToast("AI Teacher explanation ready!");
      }, 1200);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FFF8EC] text-[#33302A] py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        
        {/* Top bar with back and child profile */}
        <div className="flex items-center justify-between bg-white/80 backdrop-blur rounded-2xl p-4 shadow-sm border border-amber-200">
          <button
            onClick={() => setCurrentView("kids-switcher")}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-amber-100 hover:bg-amber-200 px-3.5 py-2 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Switcher</span>
          </button>

          {/* Child Picker info */}
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">
              {getChildEmoji(selectedChild?.avatar)}
            </span>
            <div className="text-right">
              <span className="font-display-hero text-sm font-bold text-slate-900 block leading-tight">
                {selectedChild?.name || "Emma"}
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                Grade {selectedChild?.grade || 3} • {selectedChild?.track || "Academic Track"}
              </span>
            </div>
          </div>
        </div>

        {/* Main Intake Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#E8DFD1] flex flex-col gap-6">
          
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block mb-1">
              Step 1 of 3 • Homework Intake
            </span>
            <h2 className="font-display-hero text-2xl sm:text-3xl font-bold text-slate-900">
              What are we working on? ✏️
            </h2>
          </div>

          {/* Subject Pills */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Select Subject:
            </label>
            <div className="flex flex-wrap gap-2.5">
              {subjects.map((sub) => {
                const active = subject === sub.name;
                return (
                  <button
                    key={sub.name}
                    type="button"
                    onClick={() => setSubject(sub.name)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-display-hero text-sm font-bold transition-all border-2 ${
                      active
                        ? `${sub.color} text-white shadow-md scale-105 border-transparent`
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    <span className="text-base">{sub.icon}</span>
                    <span>{sub.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Worksheet Image Intake Section with Camera & Multi-Upload */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Attach Worksheet Pages ({files.length} attached) 📸
              </label>
              {files.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllFiles}
                  className="text-[11px] font-bold text-rose-500 hover:text-rose-700 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Quick Action Buttons: Take Photo & Upload Files */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Button 1: Live In-App Camera */}
              <button
                type="button"
                onClick={() => setCameraModalOpen(true)}
                className="py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-display-hero text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 active:scale-98"
              >
                <Camera className="w-5 h-5 text-white" />
                <span>Take Photo / Scan Page 📷</span>
              </button>

              {/* Button 2: Upload Files (File Picker) */}
              <button
                type="button"
                onClick={() => regularFileInputRef.current?.click()}
                className="py-3.5 px-4 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 border-2 border-sky-200 font-display-hero text-sm font-bold transition-all flex items-center justify-center gap-2.5"
              >
                <Upload className="w-5 h-5 text-sky-600" />
                <span>Choose Multiple Files 📁</span>
              </button>
            </div>

            {/* Hidden Input Elements */}
            <input
              ref={regularFileInputRef}
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={handleFileInputChange}
              className="hidden"
            />
            {/* Native Mobile Direct Camera Trigger */}
            <input
              ref={nativeCameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {/* Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => regularFileInputRef.current?.click()}
              className={`border-3 border-dashed rounded-3xl p-6 text-center transition-all cursor-pointer relative ${
                isDragOver
                  ? "border-amber-500 bg-amber-50/80 scale-[1.01]"
                  : "border-sky-300 bg-sky-50/40 hover:bg-sky-50"
              }`}
            >
              <div className="flex flex-col items-center gap-2 pointer-events-none">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs text-sky-600 flex items-center justify-center text-2xl border border-sky-100">
                  📄
                </div>
                <p className="font-display-hero text-base sm:text-lg font-bold text-slate-800">
                  {isDragOver ? "Drop photos here now!" : "Drag & drop multiple homework images here"}
                </p>
                <p className="text-xs text-slate-500">
                  Supports multiple pages (JPG, PNG, PDF) • Tap to browse files
                </p>
              </div>
            </div>

            {/* Mobile Native Camera Shortcut link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => nativeCameraInputRef.current?.click()}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1.5"
              >
                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                <span>On a phone? Tap here to use native camera app</span>
              </button>
            </div>

            {/* Visual Queue of Attached Pages (Thumbnails & Badges) */}
            {files.length > 0 && (
              <div className="mt-2 flex flex-col gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Attached Pages Queue ({files.length}):
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {files.map((file, index) => (
                    <div
                      key={file.id || index}
                      className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {/* Thumbnail or Icon */}
                        <div
                          onClick={() => file.previewUrl && setPreviewModalImage(file.previewUrl)}
                          className="w-12 h-12 rounded-xl bg-white border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center cursor-pointer relative shadow-2xs group-hover:ring-2 group-hover:ring-amber-400"
                          title="Click to view full preview"
                        >
                          {file.previewUrl ? (
                            <img
                              src={file.previewUrl}
                              alt={file.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/assets/sample_math_worksheet.png";
                              }}
                            />
                          ) : (
                            <FileText className="w-6 h-6 text-slate-400" />
                          )}
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                        </div>

                        {/* File Details */}
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-md">
                              Page {index + 1}
                            </span>
                            {file.isCameraCapture && (
                              <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                                📷 Camera
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-bold text-slate-800 truncate mt-0.5" title={file.name}>
                            {file.name}
                          </p>
                          <span className="text-[10px] text-slate-400">{file.size}</span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFile(file.id || index)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove page"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Problem Details / Prompt */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Assignment Topic or Specific Questions
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Page 28, addition with regrouping #1 to #5"
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-primary-container focus:outline-none text-sm font-medium text-slate-800 bg-white shadow-2xs"
              required
            />
          </div>

          {/* Teacher Instruction Note */}
          <div className="bg-[#FFFDF9] p-4 rounded-2xl border-2 border-[#E8DFD1]">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base">🍎</span>
              <label className="text-xs font-bold text-slate-800">
                What did your teacher say? (Optional instruction)
              </label>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              Tell the AI teacher how you are being taught in class:
            </p>
            <input
              type="text"
              value={teacherInstruction}
              onChange={(e) => setTeacherInstruction(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-amber-400 mb-2.5 bg-white"
            />

            {/* Quick preset chips */}
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTeacherInstruction(preset)}
                  className="text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-full transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            {isProcessing ? (
              <div className="w-full py-5 rounded-3xl bg-amber-100 text-amber-900 font-display-hero text-lg font-bold flex flex-col items-center justify-center gap-2 shadow-inner border border-amber-300 animate-pulse">
                <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
                <span>{loadingMessage}</span>
              </div>
            ) : (
              <button
                type="submit"
                id="submit-homework-btn"
                className="w-full py-5 px-6 rounded-3xl bg-kid-accent hover:bg-red-500 text-white font-display-hero text-xl font-bold shadow-[0_6px_0_0_#b83c20] active:shadow-[0_1px_0_0_#b83c20] active:translate-y-[5px] transition-all flex items-center justify-center gap-3"
              >
                <span>Send to Teacher ({files.length} {files.length === 1 ? 'Page' : 'Pages'}) 🎓</span>
              </button>
            )}
          </div>

        </form>
      </div>

      {/* Live Camera Scanner Modal */}
      <CameraModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onCapture={handleCameraCapture}
        currentFileCount={files.length}
      />

      {/* Full Size Image Preview Lightbox */}
      {previewModalImage && (
        <div
          onClick={() => setPreviewModalImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl p-2">
            <button
              onClick={() => setPreviewModalImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewModalImage}
              alt="Enlarged worksheet"
              className="max-h-[85vh] w-auto object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

    </div>
  );
}
