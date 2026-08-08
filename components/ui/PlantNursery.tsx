"use client";
import React from 'react';
import { X, Droplets, Sun, Lock, ShoppingBag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGarden } from '../../context/GardenContext';
import { PLANT_SPECIES_LIST } from '../../types';

interface PlantNurseryProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlantNursery: React.FC<PlantNurseryProps> = ({ isOpen, onClose }) => {
  const { state, buyPlant } = useGarden();

  // if (!isOpen) return null;

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
            className="glass-panel w-full max-w-3xl max-h-[85vh] p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col"
          >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg glow-emerald">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-100">Botanical Nursery & Seed Bank</h2>
              <p className="text-xs text-slate-400">
                Unlock and cultivate exotic 3D flora for your virtual garden island
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

        {/* Currency Bar */}
        <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-2xl border border-white/5 my-4 shrink-0">
          <span className="text-xs font-semibold text-slate-300">Available Balance:</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-sm">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>{state.waterDrops} Drops</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-300 font-bold text-sm">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>{state.sunPoints} Sun</span>
            </div>
          </div>
        </div>

        {/* Plant Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-1 flex-1">
          {PLANT_SPECIES_LIST.map((species) => {
            const isLevelLocked = state.userLevel < species.requiredLevel;
            const canAfford =
              state.waterDrops >= species.waterCost && state.sunPoints >= species.sunCost;

            return (
              <div
                key={species.id}
                className={`glass-card p-4 rounded-2xl flex flex-col justify-between border transition-all ${
                  isLevelLocked
                    ? 'opacity-60 border-slate-800'
                    : 'border-white/10 hover:border-emerald-500/40'
                }`}
              >
                <div>
                  {/* Badge & Title */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                        species.rarity === 'Legendary'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : species.rarity === 'Epic'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : species.rarity === 'Rare'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {species.rarity}
                    </span>

                    {isLevelLocked && (
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Lock className="w-3 h-3 text-slate-500" />
                        Requires Lvl {species.requiredLevel}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-100 text-sm">{species.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{species.description}</p>
                </div>

                {/* Price & Purchase Action */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <span className="flex items-center gap-1 text-cyan-300">
                      <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                      {species.waterCost}
                    </span>
                    <span className="flex items-center gap-1 text-amber-300">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      {species.sunCost}
                    </span>
                  </div>

                  {isLevelLocked ? (
                    <button
                      disabled
                      className="px-3 py-1.5 bg-slate-800 text-slate-500 text-xs font-medium rounded-xl cursor-not-allowed"
                    >
                      Lvl {species.requiredLevel} Lock
                    </button>
                  ) : (
                    <button
                      onClick={() => buyPlant(species.id)}
                      disabled={!canAfford}
                      className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                        canAfford
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-md glow-emerald'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Buy Seed</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
