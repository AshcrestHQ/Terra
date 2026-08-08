'use client';

import React, { useState } from 'react';
import {
  Sprout,
  Droplets,
  Sun,
  Flame,
  Check,
  Plus,
  Moon,
  Sparkles,
  RotateCcw,
  X,
} from 'lucide-react';
import { useHabitStore } from '@/store/useHabitStore';

export const HabitOverlay: React.FC = () => {
  const {
    habits,
    plants,
    waterDrops,
    sunPoints,
    userLevel,
    environment,
    toggleHabit,
    addHabit,
    setEnvironment,
    resetAll,
  } = useHabitStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Health');

  const completedCount = habits.filter((h) => h.completedToday).length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addHabit(newTitle.trim(), newCategory);
    setNewTitle('');
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Top Floating Glassmorphism HUD Navbar */}
      <header className="fixed top-0 left-0 right-0 z-30 p-4 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Title & Level */}
          <div className="pointer-events-auto flex items-center gap-3 bg-slate-900/80 backdrop-blur-xl border border-white/10 px-4 py-2.5 rounded-2xl shadow-2xl">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-md">
                  Terra
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Lvl {userLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Currency & Theme Controls */}
          <div className="pointer-events-auto flex items-center gap-2">
            {/* Water Drops */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/80 border border-cyan-500/30 rounded-xl text-cyan-300 font-bold text-xs shadow-lg">
              <Droplets className="w-4 h-4 text-cyan-400 fill-cyan-400/30" />
              <span>{waterDrops} Drops</span>
            </div>

            {/* Sun Points */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/80 border border-amber-500/30 rounded-xl text-amber-300 font-bold text-xs shadow-lg">
              <Sun className="w-4 h-4 text-amber-400 fill-amber-400/30" />
              <span>{sunPoints} Sun</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setEnvironment(environment === 'day' ? 'sunset' : environment === 'sunset' ? 'night' : 'day')}
              className="p-2 bg-slate-900/80 backdrop-blur-xl border border-white/10 hover:bg-white/10 text-amber-300 rounded-xl transition-all shadow-lg"
              title="Toggle Day/Sunset/Night Theme"
            >
              {environment === 'night' ? (
                <Moon className="w-4 h-4 text-indigo-400" />
              ) : environment === 'sunset' ? (
                <Sparkles className="w-4 h-4 text-orange-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Reset */}
            <button
              onClick={() => {
                if (confirm('Reset all garden data?')) resetAll();
              }}
              className="p-2 bg-slate-900/80 backdrop-blur-xl border border-white/10 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl transition-all shadow-lg"
              title="Reset Garden"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Floating Glassmorphism Habit Drawer */}
      <div className="fixed bottom-4 left-4 z-20 w-full max-w-sm sm:max-w-md pointer-events-none">
        <div className="pointer-events-auto bg-slate-900/85 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-2xl max-h-[60vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
              <span>Daily Goals</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-medium px-2 py-0.5 rounded-full border border-emerald-500/30">
                {completedCount} / {habits.length} Completed
              </span>
            </h2>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl font-medium text-xs shadow-lg transition-all transform active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Goal</span>
            </button>
          </div>

          {/* Habit Checklist Scrollable List */}
          <div className="space-y-2.5 overflow-y-auto pr-1 my-2 flex-1">
            {habits.map((habit) => {
              const assignedPlant = plants.find((p) => p.id === habit.assignedPlantId);

              return (
                <div
                  key={habit.id}
                  className={`p-3 rounded-2xl transition-all duration-300 flex items-center justify-between gap-3 border ${
                    habit.completedToday
                      ? 'bg-emerald-950/40 border-emerald-500/40'
                      : 'bg-white/5 border-white/5 hover:border-white/20'
                  }`}
                >
                  {/* Checkbox Toggle */}
                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all transform active:scale-90 shrink-0 ${
                      habit.completedToday
                        ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 shadow-lg'
                        : 'border-2 border-slate-600 hover:border-emerald-400 text-transparent'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold text-xs truncate ${
                        habit.completedToday ? 'line-through text-slate-400' : 'text-slate-100'
                      }`}
                    >
                      {habit.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                      <span className="text-emerald-400 font-medium">{habit.category}</span>
                      {assignedPlant && (
                        <span className="text-amber-300 font-semibold uppercase">
                          Stage: {assignedPlant.stage}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Streak Flame */}
                  <div className="flex items-center gap-0.5 text-amber-400 font-bold text-xs shrink-0">
                    <Flame className="w-3.5 h-3.5 fill-amber-400/40" />
                    <span>{habit.streak}d</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Habit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900/90 backdrop-blur-xl w-full max-w-md p-6 rounded-3xl border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
                  <Sprout className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-100">Create New Goal</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 my-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Read 20 pages, 10k steps..."
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="Health">Health</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Mindfulness">Mindfulness</option>
                  <option value="Learning">Learning</option>
                  <option value="Productivity">Productivity</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl text-sm shadow-lg"
              >
                Plant Seed & Start Goal
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
