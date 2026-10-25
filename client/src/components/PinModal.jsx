import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Lock, X, Delete, KeyRound, AlertCircle } from "lucide-react";

export function PinModal() {
  const { pinModalOpen, setPinModalOpen, unlockWithPin, API_BASE, showToast } = useApp();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!pinModalOpen) return null;

  const handleKeyPress = (num) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setError("");
      if (nextPin.length === 4) {
        verifyPinCode(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError("");
  };

  const handleClear = () => {
    setPin("");
    setError("");
  };

  const verifyPinCode = async (codeToTest) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/verify-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: codeToTest })
      });
      const data = await res.json();
      if (data.success) {
        setPin("");
        unlockWithPin(true);
      } else {
        setError(data.message || "Incorrect PIN");
        setPin("");
      }
    } catch (err) {
      // Fallback local check
      if (codeToTest === "1234") {
        setPin("");
        unlockWithPin(true);
      } else {
        setError("Incorrect PIN. Demo PIN is 1234.");
        setPin("");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-2xl border border-slate-100 flex flex-col items-center text-center relative">
        
        {/* Close */}
        <button
          onClick={() => {
            setPinModalOpen(false);
            setPin("");
            setError("");
          }}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-parent-accent flex items-center justify-center mb-3 shadow-inner">
          <Lock className="w-7 h-7" />
        </div>

        <h3 className="font-display-hero text-2xl text-parent-ink font-bold">
          Guardian PIN Unlock
        </h3>
        <p className="text-slate-500 text-xs mt-1 mb-6">
          Enter your 4-digit parent security code to access settings and student mastery data.
        </p>

        {/* 4-digit Dot Display */}
        <div className="flex gap-4 mb-4">
          {[0, 1, 2, 3].map((idx) => {
            const filled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  filled
                    ? "bg-parent-accent scale-125 shadow-md"
                    : "bg-slate-200 border-2 border-slate-300"
                }`}
              />
            );
          })}
        </div>

        {error && (
          <div className="flex items-center gap-1.5 text-xs text-red-600 font-semibold mb-3 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Keypad Grid */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[260px] my-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeyPress(digit.toString())}
              disabled={isLoading}
              className="h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 text-parent-ink font-display-hero text-xl font-bold transition-all active:scale-95 flex items-center justify-center"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handleClear}
            disabled={isLoading}
            className="h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold uppercase transition-all flex items-center justify-center"
          >
            Clear
          </button>
          <button
            onClick={() => handleKeyPress("0")}
            disabled={isLoading}
            className="h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 text-parent-ink font-display-hero text-xl font-bold transition-all active:scale-95 flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all active:scale-95 flex items-center justify-center"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <KeyRound className="w-3.5 h-3.5 text-amber-500" />
            <span>Demo PIN: <strong>1234</strong></span>
          </span>
          <button
            onClick={() => showToast("A PIN reset link has been dispatched to sarah.m@kidstech.demo")}
            className="text-primary hover:underline font-medium"
          >
            Forgot PIN?
          </button>
        </div>

      </div>
    </div>
  );
}
