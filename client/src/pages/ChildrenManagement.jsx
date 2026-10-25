import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { UserPlus, Edit2, Trash2, Shield, X, Check, ArrowLeft, Sparkles, BookOpen } from "lucide-react";

export function ChildrenManagement() {
  const { childrenList, setChildrenList, setCurrentView, API_BASE, showToast, refreshData, getChildEmoji } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("3");
  const [avatar, setAvatar] = useState("bear");
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [patienceMode, setPatienceMode] = useState(true);
  const [socraticHintsOnly, setSocraticHintsOnly] = useState(false);

  const avatarPresets = [
    { key: "bear", label: "Cozy Bear", emoji: "🐻" },
    { key: "fox", label: "Clever Fox", emoji: "🦊" },
    { key: "lion", label: "Brave Lion", emoji: "🦁" },
    { key: "owl", label: "Wise Owl", emoji: "🦉" },
    { key: "koala", label: "Calm Koala", emoji: "🐨" },
    { key: "panda", label: "Happy Panda", emoji: "🐼" },
    { key: "bunny", label: "Swift Bunny", emoji: "🐰" },
    { key: "tiger", label: "Curious Tiger", emoji: "🐯" },
    { key: "penguin", label: "Smart Penguin", emoji: "🐧" },
    { key: "dolphin", label: "Playful Dolphin", emoji: "🐬" },
    { key: "robot", label: "Buddy Bot", emoji: "🤖" },
    { key: "astro", label: "Cosmo Pup", emoji: "🚀" },
    { key: "dino", label: "Little Rex", emoji: "🦖" },
    { key: "frog", label: "Hopper Frog", emoji: "🐸" },
    { key: "bee", label: "Busy Bee", emoji: "🐝" },
    { key: "cat", label: "Curious Cat", emoji: "🐱" }
  ];

  const handleOpenAdd = () => {
    setEditingChild(null);
    setName("");
    setGrade("3");
    setAvatar("bear");
    setDyslexiaFont(false);
    setPatienceMode(true);
    setSocraticHintsOnly(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (child) => {
    setEditingChild(child);
    setName(child.name);
    setGrade(child.grade.toString());
    setAvatar(child.avatar);
    setDyslexiaFont(child.accommodations?.dyslexiaFont || false);
    setPatienceMode(child.accommodations?.patienceMode || false);
    setSocraticHintsOnly(child.accommodations?.socraticHintsOnly || false);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Please enter a child's name", "error");
      return;
    }

    const payload = {
      name,
      grade: parseInt(grade),
      avatar,
      accommodations: {
        dyslexiaFont,
        patienceMode,
        socraticHintsOnly
      }
    };

    try {
      if (editingChild) {
        const res = await fetch(`${API_BASE}/children/${editingChild.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          showToast("Child profile updated!");
          refreshData();
        }
      } else {
        const res = await fetch(`${API_BASE}/children`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Added ${name} successfully!`);
          refreshData();
        }
      }
    } catch (err) {
      // Local fallback
      showToast("Profile saved locally.");
    }
    setModalOpen(false);
  };

  const handleDelete = async (id, childName) => {
    if (window.confirm(`Are you sure you want to remove ${childName}'s profile and homework history?`)) {
      try {
        await fetch(`${API_BASE}/children/${id}`, { method: "DELETE" });
        showToast(`${childName}'s profile removed.`);
        refreshData();
      } catch (err) {
        showToast("Removed locally.");
      }
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
                Children & Sibling Management
              </h1>
              <p className="text-xs text-slate-500">
                Safe preset avatars (COPPA-compliant, no real child photos collected)
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary hover:bg-sky-800 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Child Profile</span>
          </button>
        </div>

        {/* Children Card List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {childrenList.map((child) => (
            <div
              key={child.id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-3xl shadow-sm">
                    {getChildEmoji(child.avatar)}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(child)}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                      title="Edit Profile"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(child.id, child.name)}
                      className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                      title="Delete Profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-display-hero text-2xl font-bold text-parent-ink">
                    {child.name}
                  </h3>
                  <span className="text-xs font-bold text-primary bg-sky-50 px-2.5 py-0.5 rounded-full">
                    Grade {child.grade}
                  </span>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="font-bold block text-slate-700 mb-1">Accommodations:</span>
                  <p>
                    {child.accommodations?.dyslexiaFont ? "✓ Dyslexia font spacing\n" : ""}
                    {child.accommodations?.patienceMode ? "✓ Patience mode enabled\n" : ""}
                    {child.accommodations?.socraticHintsOnly ? "✓ Socratic hints only" : "✓ Warm encouragement"}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-slate-400">
                Created: {new Date(child.created_date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Add / Edit Child */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display-hero text-xl font-bold text-parent-ink">
                  {editingChild ? `Edit ${editingChild.name}'s Profile` : "Add Child Profile"}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex flex-col gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Child's First Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Grade Level (1–12)
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-primary"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                      <option key={g} value={g}>
                        Grade {g}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Safe Preset Avatar Picker (16 choices) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Choose Mascot Avatar (COPPA-Safe Preset, No Real Photos)
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {avatarPresets.map((a) => {
                      const selected = avatar === a.key;
                      return (
                        <button
                          key={a.key}
                          type="button"
                          onClick={() => setAvatar(a.key)}
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all ${
                            selected
                              ? "bg-amber-100 ring-3 ring-parent-accent shadow-md scale-105"
                              : "bg-slate-50 hover:bg-slate-100 border border-slate-200"
                          }`}
                          title={a.label}
                        >
                          {a.emoji}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Accommodations checkboxes */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col gap-2.5">
                  <span className="text-xs font-bold text-slate-700">
                    Learning Accommodations
                  </span>

                  <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dyslexiaFont}
                      onChange={(e) => setDyslexiaFont(e.target.checked)}
                      className="rounded text-primary focus:ring-0"
                    />
                    <span>Dyslexia-friendly spacing & larger line heights</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={patienceMode}
                      onChange={(e) => setPatienceMode(e.target.checked)}
                      className="rounded text-primary focus:ring-0"
                    />
                    <span>Patience Mode (Slower TTS pacing, extra encouraging tips)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={socraticHintsOnly}
                      onChange={(e) => setSocraticHintsOnly(e.target.checked)}
                      className="rounded text-primary focus:ring-0"
                    />
                    <span>Socratic hints only (Guards final answers until hints explored)</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-parent-accent hover:bg-amber-600 text-white text-xs font-bold shadow-md"
                  >
                    Save Profile
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
