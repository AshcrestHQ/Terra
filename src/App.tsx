import React, { useState } from 'react';
import { GardenProvider } from './context/GardenContext';
import { GardenCanvas } from './components/canvas/GardenCanvas';
import { Navbar } from './components/ui/Navbar';
import { HabitList } from './components/ui/HabitList';
import { HabitModal } from './components/ui/HabitModal';
import { PlantNursery } from './components/ui/PlantNursery';
import { AnalyticsModal } from './components/ui/AnalyticsModal';
import { PlantDetailsModal } from './components/ui/PlantDetailsModal';
import { GardenControls } from './components/ui/GardenControls';

export const AppContent: React.FC = () => {
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);

  return (
    <main className="w-screen h-screen relative overflow-hidden bg-slate-950 select-none">
      {/* 3D Canvas Background Viewport */}
      <GardenCanvas />

      {/* Top HUD Navigation */}
      <Navbar
        onOpenShop={() => setIsShopModalOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsModalOpen(true)}
      />

      {/* Floating Habit Tracker Goal Drawer */}
      <HabitList onOpenCreateHabit={() => setIsHabitModalOpen(true)} />

      {/* Selected Plant 3D Inspector */}
      <PlantDetailsModal />

      {/* Viewport Camera & Environment Hints */}
      <GardenControls />

      {/* Dialog Modals */}
      <HabitModal
        isOpen={isHabitModalOpen}
        onClose={() => setIsHabitModalOpen(false)}
      />
      <PlantNursery
        isOpen={isShopModalOpen}
        onClose={() => setIsShopModalOpen(false)}
      />
      <AnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
      />
    </main>
  );
};

export default function App() {
  return (
    <GardenProvider>
      <AppContent />
    </GardenProvider>
  );
}
