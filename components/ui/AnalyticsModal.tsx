"use client";
import React, { useRef } from 'react';
import {
  X,
  Trophy,
  Flame,
  Sprout,
  BarChart3,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGarden } from '../../context/GardenContext';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ isOpen, onClose }) => {
  const { habits, plants, exportData, importData, resetData } = useGarden();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // if (!isOpen) return null;

  const totalCompletions = habits.reduce((acc, h) => acc + h.history.length, 0);
  const bestOverallStreak = habits.reduce((max, h) => Math.max(max, h.bestStreak), 0);
  const averageHealth =
    plants.length > 0
      ? Math.round(plants.reduce((acc, p) => acc + p.health, 0) / plants.length)
      : 100;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const ok = importData(content);
          if (ok) {
            alert('Garden data imported successfully!');
          } else {
            alert('Invalid backup file format.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass-panel w-full max-w-2xl max-h-[85vh] p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col"
          >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg glow-cyan">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-100">Garden Analytics & Stats</h2>
              <p className="text-xs text-slate-400">
                Track your habits, streak milestones, and garden ecosystem health
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-white/10 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 shrink-0">
          <div className="glass-card p-3.5 rounded-2xl border border-emerald-500/20 text-center">
            <div className="w-8 h-8 mx-auto mb-1 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-xl font-extrabold text-emerald-300">{totalCompletions}</div>
            <div className="text-[11px] text-slate-400 font-medium">Total Goals Done</div>
          </div>

          <div className="glass-card p-3.5 rounded-2xl border border-amber-500/20 text-center">
            <div className="w-8 h-8 mx-auto mb-1 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
              <Flame className="w-4 h-4 fill-amber-400/40" />
            </div>
            <div className="text-xl font-extrabold text-amber-300">{bestOverallStreak} Days</div>
            <div className="text-[11px] text-slate-400 font-medium">Best Habit Streak</div>
          </div>

          <div className="glass-card p-3.5 rounded-2xl border border-teal-500/20 text-center">
            <div className="w-8 h-8 mx-auto mb-1 bg-teal-500/20 rounded-xl flex items-center justify-center text-teal-400">
              <Sprout className="w-4 h-4" />
            </div>
            <div className="text-xl font-extrabold text-teal-300">{plants.length}</div>
            <div className="text-[11px] text-slate-400 font-medium">Active Flora</div>
          </div>

          <div className="glass-card p-3.5 rounded-2xl border border-cyan-500/20 text-center">
            <div className="w-8 h-8 mx-auto mb-1 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="text-xl font-extrabold text-cyan-300">{averageHealth}%</div>
            <div className="text-[11px] text-slate-400 font-medium">Garden Health</div>
          </div>
        </div>

        {/* Habit Completion Table */}
        <div className="flex-1 overflow-y-auto pr-1 my-2">
          <h3 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-400" />
            Habit Breakdown & History
          </h3>

          <div className="space-y-2">
            {habits.map((h) => (
              <div
                key={h.id}
                className="bg-slate-900/60 p-3 rounded-2xl border border-white/5 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-200">{h.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Category: <span className="text-emerald-400">{h.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <div className="font-bold text-amber-400 flex items-center gap-1 justify-end">
                      <Flame className="w-3 h-3 fill-amber-400/40" />
                      {h.streak}d streak
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {h.history.length} total check-ins
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Import/Export & Reset Controls */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between shrink-0 gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={exportData}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all border border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all border border-slate-700"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Import JSON</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset all garden data?')) {
                resetData();
                onClose();
              }
            }}
            className="flex items-center gap-1 px-3 py-2 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
          </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
