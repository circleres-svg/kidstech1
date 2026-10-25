import React, { useState, useRef, useEffect } from "react";
import { Camera, X, RefreshCw, Check, AlertCircle, RotateCcw, Sparkles } from "lucide-react";

export function CameraModal({ isOpen, onClose, onCapture, currentFileCount = 0 }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [facingMode, setFacingMode] = useState("environment"); // 'environment' for rear, 'user' for front
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [flashEffect, setFlashEffect] = useState(false);

  // Check available video devices
  useEffect(() => {
    async function checkDevices() {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputs = devices.filter((d) => d.kind === "videoinput");
          setHasMultipleCameras(videoInputs.length > 1);
        } catch (e) {
          // ignore enumeration error
        }
      }
    }
    checkDevices();
  }, []);

  // Start video stream when modal opens or facing mode toggles
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedImage(null);
      return;
    }

    startCamera(facingMode);

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async (mode) => {
    setIsInitializing(true);
    setCameraError(null);
    stopCamera();

    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        });
      } catch (err) {
        // Fallback to basic video constraint if ideal facingMode fails
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsInitializing(false);
    } catch (err) {
      console.error("Camera access error:", err);
      setIsInitializing(false);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError("Camera permission was denied. Please allow camera permissions in your browser bar, or choose 'Upload File' instead.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraError("No camera device was detected on your computer or phone.");
      } else {
        setCameraError("Unable to access camera: " + (err.message || "Unknown error"));
      }
    }
  };

  // Toggle front/back camera
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  // Capture current frame from video to canvas
  const takeSnapshot = () => {
    if (!videoRef.current) return;

    // Trigger visual shutter flash
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 200);

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Draw image
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      setCapturedImage(dataUrl);
    }
  };

  // Accept photo and send to parent
  const handleAcceptPhoto = (keepOpenForMore = false) => {
    if (!capturedImage) return;

    // Convert dataUrl to a File object
    const pageNum = currentFileCount + 1;
    const filename = `worksheet_photo_page_${pageNum}_${Date.now()}.jpg`;

    // Estimate file size from base64
    const approxBytes = Math.round((capturedImage.length * 3) / 4);
    const sizeMb = (approxBytes / (1024 * 1024)).toFixed(1);

    const fileItem = {
      id: `cam-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: filename,
      size: `${sizeMb > 0 ? sizeMb : "<0.5"} MB`,
      type: "image/jpeg",
      previewUrl: capturedImage,
      isCameraCapture: true,
      dataUrl: capturedImage
    };

    onCapture(fileItem);

    if (keepOpenForMore) {
      setCapturedImage(null);
      startCamera(facingMode);
    } else {
      onClose();
    }
  };

  // Discard and retake
  const handleRetake = () => {
    setCapturedImage(null);
    startCamera(facingMode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-slate-900 text-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display-hero text-base font-bold text-white">
                Snap Worksheet Photo 📷
              </h3>
              <p className="text-[11px] text-slate-400">
                {capturedImage ? "Review captured photo" : "Align homework page inside the guide lines"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close Camera"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[340px] sm:min-h-[420px] overflow-hidden">
          
          {/* Shutter flash animation */}
          {flashEffect && <div className="absolute inset-0 bg-white z-40 animate-fadeOut" />}

          {/* Error Message */}
          {cameraError && (
            <div className="p-6 text-center max-w-md flex flex-col items-center gap-3">
              <AlertCircle className="w-12 h-12 text-rose-500" />
              <h4 className="font-bold text-base text-rose-300">Camera Unavailable</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{cameraError}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => startCamera(facingMode)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-600 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-bold"
                >
                  Close & Upload File
                </button>
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {isInitializing && !cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 z-20">
              <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-semibold text-slate-300">Opening camera...</span>
            </div>
          )}

          {/* Live Video Feed */}
          {!capturedImage && (
            <div className="w-full h-full relative flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover max-h-[500px]"
              />

              {/* Viewfinder Target Framing Guidelines */}
              <div className="absolute inset-6 sm:inset-10 border-2 border-white/40 rounded-2xl pointer-events-none flex flex-col justify-between p-3 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]">
                {/* 4 Corner Markers */}
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-t-4 border-l-4 border-amber-400 rounded-tl-md" />
                  <div className="w-6 h-6 border-t-4 border-r-4 border-amber-400 rounded-tr-md" />
                </div>

                <div className="text-center">
                  <span className="bg-black/60 backdrop-blur-xs text-amber-200 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-400/30 shadow-md">
                    📄 Fit full page inside guide
                  </span>
                </div>

                <div className="flex justify-between">
                  <div className="w-6 h-6 border-b-4 border-l-4 border-amber-400 rounded-bl-md" />
                  <div className="w-6 h-6 border-b-4 border-r-4 border-amber-400 rounded-br-md" />
                </div>
              </div>
            </div>
          )}

          {/* Review Snapped Photo */}
          {capturedImage && (
            <div className="w-full h-full relative flex items-center justify-center bg-black">
              <img
                src={capturedImage}
                alt="Captured homework sheet"
                className="w-full h-full object-contain max-h-[500px]"
              />
              <div className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Page Photo Ready</span>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Control Bar */}
        <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
          
          {!capturedImage ? (
            <>
              {/* Flip camera button */}
              <div className="w-16">
                {hasMultipleCameras && (
                  <button
                    onClick={toggleFacingMode}
                    className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Flip camera (front / back)"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Big Shutter Button */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={takeSnapshot}
                  disabled={isInitializing || !!cameraError}
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white hover:bg-amber-100 p-1.5 shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center ring-4 ring-amber-400/50"
                  aria-label="Take Photo"
                >
                  <div className="w-full h-full rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-slate-900 font-bold">
                    <Camera className="w-6 h-6" />
                  </div>
                </button>
                <span className="text-[10px] text-slate-400 font-semibold mt-1">Tap to Snap</span>
              </div>

              <div className="w-16 flex justify-end">
                <button
                  onClick={onClose}
                  className="text-xs font-bold text-slate-400 hover:text-white px-2 py-1"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            /* Confirm or Retake Controls */
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRetake}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700"
              >
                <RefreshCw className="w-4 h-4 text-amber-400" />
                <span>Retake Photo</span>
              </button>

              <div className="w-full sm:w-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAcceptPhoto(true)}
                  className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                  title="Save this photo and snap another page"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Snap Next Page</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAcceptPhoto(false)}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Done & Attach</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
