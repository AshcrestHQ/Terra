'use client';

import dynamic from 'next/dynamic';
import { HabitOverlay } from '@/components/ui/HabitOverlay';

// Dynamic import for R3F Canvas to prevent SSR window issues
const GardenScene = dynamic(() => import('@/components/canvas/GardenScene'), {
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen flex items-center justify-center bg-slate-950 text-emerald-400 font-bold text-lg">
      Loading 3D Garden Ecosystem...
    </div>
  ),
});

export default function Home() {
  return (
    <main className="w-screen h-screen relative overflow-hidden bg-slate-950 select-none">
      {/* 3D Canvas Background Engine */}
      <GardenScene />

      {/* 2D Glassmorphism Overlay HUD */}
      <HabitOverlay />
    </main>
  );
}
