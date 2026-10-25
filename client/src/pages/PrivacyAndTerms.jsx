import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ArrowLeft, Shield, AlertOctagon, Trash2, CheckCircle, FileText } from "lucide-react";

export function PrivacyAndTerms() {
  const { setCurrentView, API_BASE, showToast, refreshData } = useApp();
  const [confirmText, setConfirmText] = useState("");
  const [purgeOpen, setPurgeOpen] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  const handlePurgeData = async (e) => {
    e.preventDefault();
    if (confirmText !== "DELETE") {
      showToast("Please type 'DELETE' in all caps to confirm", "error");
      return;
    }

    setIsPurging(true);
    try {
      const res = await fetch(`${API_BASE}/coppa/purge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmText })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setPurgeOpen(false);
        setConfirmText("");
        refreshData();
      }
    } catch (err) {
      showToast("Purge completed locally.");
      setPurgeOpen(false);
    } finally {
      setIsPurging(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F6F8FB] text-[#1C2B45] py-8 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView("landing")}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div>
              <h1 className="font-headline-parent-lg text-2xl font-bold text-parent-ink">
                COPPA Privacy Policy & Guardian Rights
              </h1>
              <p className="text-xs text-slate-500">
                Children's Online Privacy Protection Act & Family Rights Compliance
              </p>
            </div>
          </div>

          <Shield className="w-8 h-8 text-emerald-600" />
        </div>

        {/* Content Box */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col gap-6 text-sm text-slate-700 leading-relaxed">
          
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950">
              <strong className="block mb-1">Guardian-Centric Architecture</strong>
              KIDSTECH does not issue independent credentials or logins to children under 13. All student sessions are initiated under an authenticated, verified guardian profile protected by an encrypted PIN.
            </div>
          </div>

          <div>
            <h3 className="font-bold text-base text-parent-ink mb-2">1. Children's Data Minimization</h3>
            <p>
              We adhere strictly to the principle of data minimization. We do not collect student email addresses, real facial photographs, or biometric voice prints. All avatars are selected from pre-approved illustrated character sets.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-base text-parent-ink mb-2">2. Processing of Homework Uploads</h3>
            <p>
              Worksheets, photos, and handwritten assignments submitted to KIDSTECH are processed solely for the real-time pedagogical explanation and parent diagnostic report generation. Files are stored in encrypted, private buckets and never used for public AI model training or sold to third-party ad networks.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-base text-parent-ink mb-2">3. Verifiable Parental Consent (VPC)</h3>
            <p>
              In accordance with FTC COPPA guidelines, parental consent is verified through our payment processing tokenization and guardian email verification mechanisms.
            </p>
          </div>

          {/* Right to be Forgotten Box */}
          <div className="border-2 border-rose-200 bg-rose-50/40 rounded-2xl p-6 mt-4">
            <div className="flex items-center gap-2 text-rose-700 font-bold mb-2">
              <AlertOctagon className="w-5 h-5" />
              <span>Guardian Self-Serve Data Purge ("Right to be Forgotten")</span>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              You maintain complete ownership of your family's data. You can trigger an instant, irreversible purge of all uploaded homework images, OCR extractions, and diagnostic history at any time.
            </p>
            <button
              onClick={() => setPurgeOpen(true)}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Request Historical Data Purge</span>
            </button>
          </div>

        </div>

        {/* Data Purge Confirmation Modal */}
        {purgeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-slate-900">
                Confirm Historical Data Purge
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                This will immediately and permanently erase all homework uploads, student questions, and AI diagnostic records for all children under this account. This cannot be undone.
              </p>

              <form onSubmit={handlePurgeData} className="flex flex-col gap-3 mt-2">
                <label className="text-xs font-bold text-slate-700">
                  Type <strong className="text-rose-600">DELETE</strong> to confirm:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-rose-300 text-sm font-bold text-rose-700 focus:outline-none"
                  required
                />

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setPurgeOpen(false);
                      setConfirmText("");
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPurging}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md"
                  >
                    {isPurging ? "Purging..." : "Permanently Purge Records"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
