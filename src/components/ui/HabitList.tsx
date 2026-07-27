import React, { useState } from 'react';
import {
  Check,
  Plus,
  Flame,
  Droplets,
  Sun,
  Trash2,
  Sprout,
} from 'lucide-react';
import { useGarden } from '../../context/GardenContext';
import { PLANT_SPECIES_LIST } from '../../types';

interface HabitListProps {
  onOpenCreateHabit: () => void;
}

export const HabitList: React.FC<HabitListProps> = ({ onOpenCreateHabit }) => {
  const { habits, plants, completeHabit, deleteHabit, setSelectedPlantId } = useGarden();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories: string[] = ['All', 'Mindfulness', 'Fitness', 'Learning', 'Health', 'Productivity', 'Creative'];

  const filteredHabits = habits.filter(
    (h) => selectedCategory === 'All' || h.category === selectedCategory
  );

  const completedCount = habits.filter((h) => h.completedToday).length;

  return (
    <div className="fixed bottom-4 left-4 z-20 w-full max-w-sm sm:max-w-md pointer-events-none">
      <div className="pointer-events-auto glass-panel p-4 rounded-3xl shadow-2xl border border-white/10 max-h-[65vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h2 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
              <span>Daily Goals</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-medium px-2 py-0.5 rounded-full border border-emerald-500/30">
                {completedCount} / {habits.length} Done
              </span>
            </h2>
          </div>
          <button
            onClick={onOpenCreateHabit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl font-medium text-xs shadow-lg glow-emerald transition-all transform hover:scale-105"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Goal</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 py-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Habits Scrollable List */}
        <div className="space-y-2.5 overflow-y-auto pr-1 my-2 flex-1">
          {filteredHabits.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              <Sprout className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
              <p>No habits in this category yet.</p>
              <p className="text-slate-500 mt-1">Add one to start growing your garden!</p>
            </div>
          ) : (
            filteredHabits.map((habit) => {
              const assignedPlant = plants.find((p) => p.id === habit.assignedPlantId);
              const speciesInfo = assignedPlant
                ? PLANT_SPECIES_LIST.find((s) => s.id === assignedPlant.speciesId)
                : null;

              return (
                <div
                  key={habit.id}
                  className={`glass-card p-3 rounded-2xl transition-all duration-300 flex items-center justify-between gap-3 border ${
                    habit.completedToday
                      ? 'bg-emerald-950/30 border-emerald-500/30'
                      : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  {/* Checkbox Action */}
                  <button
                    onClick={() => completeHabit(habit.id)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 transform active:scale-90 shrink-0 ${
                      habit.completedToday
                        ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 shadow-md glow-emerald'
                        : 'border-2 border-slate-600 hover:border-emerald-400 text-transparent'
                    }`}
                  >
                    <Check className="w-5 h-5 stroke-[3]" />
                  </button>

                  {/* Habit Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`font-semibold text-xs sm:text-sm truncate ${
                          habit.completedToday ? 'line-through text-slate-400' : 'text-slate-100'
                        }`}
                      >
                        {habit.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2.5 mt-1 text-[11px] text-slate-400">
                      {/* Streak Flame */}
                      <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                        <Flame className="w-3 h-3 fill-amber-400/40" />
                        {habit.streak}d streak
                      </span>

                      {/* Reward pills */}
                      <span className="flex items-center gap-0.5 text-cyan-300">
                        <Droplets className="w-3 h-3" />+{habit.waterReward}
                      </span>
                      <span className="flex items-center gap-0.5 text-amber-300">
                        <Sun className="w-3 h-3" />+{habit.sunReward}
                      </span>
                    </div>
                  </div>

                  {/* Plant Badge & Delete */}
                  <div className="flex items-center gap-1 shrink-0">
                    {assignedPlant && speciesInfo && (
                      <button
                        onClick={() => setSelectedPlantId(assignedPlant.id)}
                        className="p-1.5 bg-slate-800/60 hover:bg-slate-700/80 rounded-lg text-emerald-400 transition-all border border-emerald-500/20"
                        title={`View linked plant: ${speciesInfo.name}`}
                      >
                        <Sprout className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="p-1.5 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 rounded-lg transition-all"
                      title="Delete Habit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
