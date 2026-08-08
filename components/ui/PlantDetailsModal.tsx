"use client";
import React from 'react';
import { X, Droplets, Sprout, Heart, Sparkles, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGarden } from '../../context/GardenContext';
import { PLANT_SPECIES_LIST } from '../../types';

export const PlantDetailsModal: React.FC = () => {
  const { habits, plants, state, waterPlantDirectly, setSelectedPlantId } = useGarden();

  // if (!state.selectedPlantId) return null;

  const plant = plants.find((p) => p.id === state.selectedPlantId);
  // if (!plant) return null;

  const species = PLANT_SPECIES_LIST.find((s) => s.id === plant.speciesId) || PLANT_SPECIES_LIST[0];
  const linkedHabit = habits.find((h) => h.id === plant.habitId);

  const stageLabels = ['Seed', 'Sprout', 'Sapling', 'Mature', 'Blooming Mythic'];

  return (
    <AnimatePresence>
      {state.selectedPlantId && plant && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-20 right-4 z-40 w-full max-w-xs pointer-events-none"
        >
          <div className="pointer-events-auto glass-panel p-4 rounded-3xl border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/20 rounded-xl text-emerald-400">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">{species.name}</h3>
              <span className="text-[10px] text-emerald-400 font-semibold capitalize">
                {species.rarity} Flora
              </span>
            </div>
          </div>
          <button
            onClick={() => setSelectedPlantId(null)}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Plant Details */}
        <div className="my-3 space-y-2 text-xs">
          {/* Stage Progress */}
          <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-xl border border-white/5">
            <span className="text-slate-400">Growth Stage:</span>
            <span className="font-bold text-amber-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {stageLabels[plant.stage]} ({plant.waterCount} Waterings)
            </span>
          </div>

          {/* Health Bar */}
          <div className="bg-slate-900/60 p-2 rounded-xl border border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-400 fill-rose-400/40" />
                Vigor / Health:
              </span>
              <span className="font-bold text-rose-300">{plant.health}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-500 to-emerald-400 h-full rounded-full transition-all"
                style={{ width: `${plant.health}%` }}
              />
            </div>
          </div>

          {/* Linked Goal */}
          {linkedHabit && (
            <div className="bg-slate-900/60 p-2 rounded-xl border border-white/5">
              <span className="text-slate-400 block mb-0.5">Nurtured By Goal:</span>
              <span className="font-semibold text-emerald-300 block truncate">{linkedHabit.title}</span>
            </div>
          )}

          {/* Planted Date */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-500" />
              Planted: {plant.plantedAt}
            </span>
          </div>
        </div>

        {/* Direct Water Action Button */}
        <button
          onClick={() => waterPlantDirectly(plant.id)}
          disabled={state.waterDrops < 15}
          className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md ${
            state.waterDrops >= 15
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white glow-cyan'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Droplets className="w-4 h-4 text-cyan-200 fill-cyan-200/40" />
          <span>Water Flora (-15 Drops)</span>
        </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
