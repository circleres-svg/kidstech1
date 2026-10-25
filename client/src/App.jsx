import React from "react";
import { useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { PinModal } from "./components/PinModal";
import { AuthModal } from "./components/AuthModal";
import { LandingPage } from "./pages/LandingPage";
import { KidsDashboard } from "./pages/KidsDashboard";
import { HomeworkUpload } from "./pages/HomeworkUpload";
import { ExplanationView } from "./pages/ExplanationView";
import { InteractivePractice } from "./pages/InteractivePractice";
import { WorksheetGenerator } from "./pages/WorksheetGenerator";
import { ParentDashboard } from "./pages/ParentDashboard";
import { MasteryReport } from "./pages/MasteryReport";
import { ChildrenManagement } from "./pages/ChildrenManagement";
import { SubscriptionBilling } from "./pages/SubscriptionBilling";
import { AdminCurriculum } from "./pages/AdminCurriculum";
import { PrivacyAndTerms } from "./pages/PrivacyAndTerms";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function App() {
  const { currentView, toast } = useApp();

  return (
    <div className="min-h-screen flex flex-col font-body-parent-md">
      {/* Universal Header */}
      <Header />

      {/* Main Content Area (offset by header height) */}
      <main className="flex-1 pt-20">
        {currentView === "landing" && <LandingPage />}
        {currentView === "kids-switcher" && <KidsDashboard />}
        {currentView === "upload" && <HomeworkUpload />}
        {currentView === "explanation" && <ExplanationView />}
        {currentView === "practice" && <InteractivePractice />}
        {currentView === "worksheet" && <WorksheetGenerator />}
        {currentView === "parent-dashboard" && <ParentDashboard />}
        {currentView === "mastery" && <MasteryReport />}
        {currentView === "children-profiles" && <ChildrenManagement />}
        {currentView === "subscription" && <SubscriptionBilling />}
        {currentView === "admin-curriculum" && <AdminCurriculum />}
        {currentView === "privacy-terms" && <PrivacyAndTerms />}
      </main>

      {/* Guardian PIN Gate Modal */}
      <PinModal />

      {/* Guardian Auth & Signup Modal */}
      <AuthModal />

      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800 text-xs font-semibold animate-slideUp">
          {toast.type === "error" ? (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default App;
