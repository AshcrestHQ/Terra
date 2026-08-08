"use client";

import React, { useState } from 'react';
import { GardenProvider } from '../context/GardenContext';
import { GardenCanvas } from '../components/canvas/GardenCanvas';
import { Navbar } from '../components/ui/Navbar';
import { HabitList } from '../components/ui/HabitList';
import { HabitModal } from '../components/ui/HabitModal';
import { PlantNursery } from '../components/ui/PlantNursery';
import { AnalyticsModal } from '../components/ui/AnalyticsModal';
import { PlantDetailsModal } from '../components/ui/PlantDetailsModal';
import { GardenControls } from '../components/ui/GardenControls';

const AppContent: React.FC = () => {
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);

  return (
    <main className="w-screen h-screen relative overflow-hidden bg-slate-950 select-none">
      <GardenCanvas />
      <Navbar
        onOpenShop={() => setIsShopModalOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsModalOpen(true)}
      />
      <HabitList onOpenCreateHabit={() => setIsHabitModalOpen(true)} />
      <PlantDetailsModal />
      <GardenControls />
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

export default function Page() {
  return (
    <GardenProvider>
      <AppContent />
    </GardenProvider>
  );
}
