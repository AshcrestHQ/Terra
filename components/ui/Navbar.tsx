"use client";
import React from 'react';
import {
  Sprout,
  Droplets,
  Sun,
  Volume2,
  VolumeX,
  CloudRain,
  Moon,
  BarChart3,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useGarden } from '../../context/GardenContext';

interface NavbarProps {
  onOpenShop: () => void;
  onOpenAnalytics: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenShop, onOpenAnalytics }) => {
  const { state, setEnvironment, setWeather, toggleSound } = useGarden();

  const xpPercent = Math.min(100, Math.floor((state.currentXP / state.requiredXP) * 100));

  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-4 py-3 pointer-events-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* App Title & Level Progress */}
        <div className="pointer-events-auto flex items-center gap-3 glass-panel px-4 py-2 rounded-2xl">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-xl shadow-lg glow-emerald">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg tracking-wide text-gradient-emerald">
                Sprout & Flourish
              </h1>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Lvl {state.userLevel}
              </span>
            </div>
            {/* XP Bar */}
            <div className="w-36 bg-slate-800/80 h-2 rounded-full overflow-hidden mt-1 border border-slate-700">
              <div
                className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full transition-all duration-500 rounded-full"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Currency & Streak Stats */}
        <div className="pointer-events-auto flex items-center gap-2 glass-panel px-4 py-2 rounded-2xl">
          {/* Water Drops */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-cyan-950/60 border border-cyan-500/30 rounded-xl text-cyan-300 font-bold text-sm">
            <Droplets className="w-4 h-4 text-cyan-400 fill-cyan-400/30 animate-pulse" />
            <span>{state.waterDrops}</span>
          </div>

          {/* Sun Points */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-950/60 border border-amber-500/30 rounded-xl text-amber-300 font-bold text-sm">
            <Sun className="w-4 h-4 text-amber-400 fill-amber-400/30" />
            <span>{state.sunPoints}</span>
          </div>
        </div>

        {/* Action Controls & Environment Toggles */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Plant Shop Button */}
          <button
            onClick={onOpenShop}
            className="flex items-center gap-2 px-3.5 py-2 glass-card bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border-emerald-500/40 rounded-xl font-medium text-sm transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Nursery</span>
          </button>

          {/* Analytics Button */}
          <button
            onClick={onOpenAnalytics}
            className="flex items-center gap-2 px-3.5 py-2 glass-card hover:bg-white/10 text-slate-200 rounded-xl font-medium text-sm transition-all"
          >
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Stats</span>
          </button>

          {/* Theme Switcher Group */}
          <div className="flex items-center glass-panel rounded-xl p-1 gap-1">
            <button
              onClick={() => setEnvironment('day')}
              className={`p-1.5 rounded-lg transition-all ${
                state.environment === 'day' ? 'bg-amber-500/30 text-amber-300' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Day Mode"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setEnvironment('sunset')}
              className={`p-1.5 rounded-lg transition-all ${
                state.environment === 'sunset' ? 'bg-orange-500/30 text-orange-300' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Sunset Mode"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setEnvironment('night')}
              className={`p-1.5 rounded-lg transition-all ${
                state.environment === 'night' ? 'bg-indigo-500/30 text-indigo-300' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Night Mode"
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>

          {/* Weather Toggle */}
          <button
            onClick={() => setWeather(state.weather === 'sunny' ? 'rain' : state.weather === 'rain' ? 'magic' : 'sunny')}
            className="p-2 glass-panel hover:bg-white/10 text-cyan-300 rounded-xl transition-all"
            title={`Weather: ${state.weather}`}
          >
            <CloudRain className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 glass-panel hover:bg-white/10 text-slate-300 rounded-xl transition-all"
            title={state.soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {state.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
