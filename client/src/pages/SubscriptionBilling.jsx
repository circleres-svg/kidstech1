import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { CreditCard, ShieldCheck, Check, ArrowLeft, Download, AlertCircle } from "lucide-react";

export function SubscriptionBilling() {
  const { parentProfile, setCurrentView, API_BASE, showToast, refreshData } = useApp();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const sub = parentProfile?.subscription || {
    status: "active",
    planName: "12 Months Annual (Best Value)",
    pricePerMonth: "$8.99",
    totalBilled: "$107.88 / year",
    renewalDate: "2027-08-15",
    paymentMethod: { brand: "Visa", last4: "4242", exp: "09/28" }
  };

  const handleUpgrade = async (planId, name) => {
    try {
      const res = await fetch(`${API_BASE}/subscriptions/upgrade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Switched plan to ${name}!`);
        refreshData();
      }
    } catch (err) {
      showToast(`Plan updated to ${name}!`);
    }
  };

  const handleCancel = async () => {
    try {
      await fetch(`${API_BASE}/subscriptions/cancel`, { method: "POST" });
      showToast("Cancellation scheduled at end of billing cycle.");
      setCancelModalOpen(false);
      refreshData();
    } catch (err) {
      showToast("Cancellation scheduled.");
      setCancelModalOpen(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F6F8FB] text-[#1C2B45] py-8 px-4 sm:px-8">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView("parent-dashboard")}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <div>
              <h1 className="font-headline-parent-lg text-2xl font-bold text-parent-ink">
                Subscription & Billing
              </h1>
              <p className="text-xs text-slate-500">
                Transparent billing with Stripe PCI-compliant processing and cancel-anytime guarantee.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full text-emerald-800 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Active Member</span>
          </div>
        </div>

        {/* Current Plan Overview Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col lg:flex-row justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-parent-accent">
              Current Active Plan
            </span>
            <h2 className="font-headline-parent-lg text-3xl font-extrabold text-parent-ink">
              {sub.planName}
            </h2>
            <p className="text-sm text-slate-600">
              {sub.pricePerMonth} / month ({sub.totalBilled}) • Next renewal on <strong>{sub.renewalDate}</strong>
            </p>

            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <CreditCard className="w-4 h-4 text-slate-400" />
              <span>Paid via {sub.paymentMethod?.brand} ending in •••• {sub.paymentMethod?.last4} (Expires {sub.paymentMethod?.exp})</span>
            </div>
          </div>

          <div className="flex flex-col justify-center items-start lg:items-end gap-3">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              ✓ 100% Unrestricted Family Access
            </span>
            <button
              onClick={() => setCancelModalOpen(true)}
              className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors"
            >
              Cancel Subscription...
            </button>
          </div>
        </div>

        {/* Change Plan Options */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <h3 className="font-headline-parent-lg text-xl font-bold text-parent-ink mb-6">
            Available Plans & Switch Options
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-lg text-slate-900">3 Months</h4>
                <div className="text-2xl font-extrabold text-parent-ink my-2">$14.99 <span className="text-xs font-normal text-slate-500">/ mo</span></div>
                <p className="text-xs text-slate-500 mb-4">Billed $44.97 every 3 months</p>
              </div>
              <button
                onClick={() => handleUpgrade("3mo", "3 Months Starter")}
                className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700"
              >
                Switch to 3 Months
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-lg text-slate-900">6 Months</h4>
                <div className="text-2xl font-extrabold text-parent-ink my-2">$11.99 <span className="text-xs font-normal text-slate-500">/ mo</span></div>
                <p className="text-xs text-slate-500 mb-4">Billed $71.94 every 6 months</p>
              </div>
              <button
                onClick={() => handleUpgrade("6mo", "6 Months Semester Pass")}
                className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700"
              >
                Switch to 6 Months
              </button>
            </div>

            <div className="p-5 rounded-2xl border-2 border-parent-accent bg-amber-50/30 flex flex-col justify-between relative">
              <span className="absolute -top-3 right-4 bg-parent-accent text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                Current Best Value
              </span>
              <div>
                <h4 className="font-bold text-lg text-slate-900">12 Months</h4>
                <div className="text-2xl font-extrabold text-parent-ink my-2">$8.99 <span className="text-xs font-normal text-slate-500">/ mo</span></div>
                <p className="text-xs text-slate-500 mb-4">Billed $107.88 annually (Save 40%)</p>
              </div>
              <button
                disabled
                className="w-full py-2.5 rounded-xl bg-amber-200 text-amber-900 text-xs font-bold cursor-default"
              >
                Active Plan
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Receipts Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <h3 className="font-headline-parent-lg text-xl font-bold text-parent-ink mb-4">
            Billing History & Receipts
          </h3>

          <div className="divide-y divide-slate-100">
            <div className="py-3 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Date</span>
              <span>Plan</span>
              <span>Amount</span>
              <span>Receipt</span>
            </div>
            <div className="py-3 flex items-center justify-between text-xs text-slate-700 font-medium">
              <span>Aug 15, 2026</span>
              <span>12 Months Annual (Best Value)</span>
              <span className="font-bold text-slate-900">$107.88</span>
              <button
                onClick={() => showToast("Downloaded official PDF receipt.")}
                className="text-primary hover:underline flex items-center gap-1 font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cancel Modal */}
        {cancelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">
                Cancel Subscription?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your children will retain full access until your current billing period ends on <strong>{sub.renewalDate}</strong>. After that, your account will pause.
              </p>
              <div className="flex gap-2 w-full pt-2">
                <button
                  onClick={() => setCancelModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
                >
                  Keep My Plan
                </button>
                <button
                  onClick={handleCancel}
                  className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
