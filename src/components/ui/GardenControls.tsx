import React from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { useGarden } from '../../context/GardenContext';

export const GardenControls: React.FC = () => {
  const { state } = useGarden();

  return (
    <div className="fixed bottom-4 right-4 z-20 pointer-events-none hidden sm:block">
      <div className="pointer-events-auto glass-panel px-3.5 py-2 rounded-2xl flex items-center gap-3 text-xs text-slate-300 shadow-xl border border-white/10">
        <div className="flex items-center gap-1.5 text-slate-400 font-medium">
          <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
          <span>Drag to orbit • Scroll to zoom</span>
        </div>
        <div className="h-3 w-px bg-white/10" />
        <div className="flex items-center gap-1 text-amber-300 font-semibold capitalize">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{state.environment} View</span>
        </div>
      </div>
    </div>
  );
};
