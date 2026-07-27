import React, { useState } from 'react';
import { X, Sprout, Plus, Sparkles } from 'lucide-react';
import { useGarden } from '../../context/GardenContext';
import type { HabitCategory } from '../../types';
import { PLANT_SPECIES_LIST } from '../../types';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_HABITS = [
  { title: 'Drink 2L Water Daily', category: 'Health' as HabitCategory },
  { title: '30 Mins Daily Workout', category: 'Fitness' as HabitCategory },
  { title: 'Read 15 Pages of a Book', category: 'Learning' as HabitCategory },
  { title: '10 Mins Morning Meditation', category: 'Mindfulness' as HabitCategory },
  { title: 'Code for 1 Hour', category: 'Productivity' as HabitCategory },
  { title: 'Journal & Gratitude', category: 'Creative' as HabitCategory },
];

export const HabitModal: React.FC<HabitModalProps> = ({ isOpen, onClose }) => {
  const { state, addHabit } = useGarden();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HabitCategory>('Health');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>('sprout');

  if (!isOpen) return null;

  const categories: HabitCategory[] = [
    'Health',
    'Fitness',
    'Mindfulness',
    'Learning',
    'Productivity',
    'Creative',
  ];

  const unlockedSpeciesList = PLANT_SPECIES_LIST.filter((s) =>
    state.unlockedSpecies.includes(s.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addHabit(title.trim(), category, frequency, selectedSpeciesId);
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-white/10 shadow-2xl animate-pulse-subtle">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
              <Sprout className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-100">Create New Daily Goal</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-white/10 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="my-4">
          <label className="text-xs font-semibold text-slate-400 block mb-2">
            Quick Ideas:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_HABITS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setTitle(preset.title);
                  setCategory(preset.category);
                }}
                className="text-xs px-2.5 py-1 bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 rounded-lg border border-slate-700 transition-all flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                {preset.title}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Goal / Habit Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Read 20 pages, 30 min run..."
              className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
            />
          </div>

          {/* Category Select */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all text-center ${
                    category === cat
                      ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50'
                      : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Select Plant Seed to Plant in Garden */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Choose Seed to Plant for this Habit
            </label>
            <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
              {unlockedSpeciesList.map((species) => (
                <button
                  type="button"
                  key={species.id}
                  onClick={() => setSelectedSpeciesId(species.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedSpeciesId === species.id
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-slate-100'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs text-slate-200">{species.name}</div>
                  <div className="text-[10px] text-emerald-400 capitalize mt-0.5">
                    {species.rarity}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Frequency Toggle */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold text-slate-300">Repeat Frequency</span>
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setFrequency('daily')}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                  frequency === 'daily'
                    ? 'bg-emerald-500/30 text-emerald-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Daily
              </button>
              <button
                type="button"
                onClick={() => setFrequency('weekly')}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                  frequency === 'weekly'
                    ? 'bg-emerald-500/30 text-emerald-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Weekly
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-2xl shadow-lg glow-emerald transition-all transform active:scale-95 flex items-center justify-center gap-2 mt-4"
          >
            <Plus className="w-5 h-5" />
            <span>Plant Seed & Start Goal</span>
          </button>
        </form>
      </div>
    </div>
  );
};
