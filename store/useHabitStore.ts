import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import confetti from 'canvas-confetti';

export type GrowthStage = 'SEED' | 'SPROUT' | 'SAPLING' | 'MATURE' | 'BLOOMING';

export interface Plant {
  id: string;
  speciesName: string;
  stage: GrowthStage;
  position: [number, number, number];
  waterCount: number;
  glbModelPath: string;
  scaleMultiplier: number;
}

export interface Habit {
  id: string;
  title: string;
  category: string;
  streak: number;
  completedToday: boolean;
  assignedPlantId: string;
}

interface HabitState {
  habits: Habit[];
  plants: Plant[];
  waterDrops: number;
  sunPoints: number;
  userLevel: number;
  environment: 'day' | 'sunset' | 'night';
  
  toggleHabit: (id: string) => void;
  addHabit: (title: string, category: string) => void;
  setEnvironment: (env: 'day' | 'sunset' | 'night') => void;
  resetAll: () => void;
}

const getGlbForStage = (stage: GrowthStage): { model: string; scale: number } => {
  switch (stage) {
    case 'SEED':
      return { model: '/models/seed.glb', scale: 0.45 };
    case 'SPROUT':
      return { model: '/models/sprout.glb', scale: 0.7 };
    case 'SAPLING':
      return { model: '/models/sapling.glb', scale: 1.0 };
    case 'MATURE':
      return { model: '/models/mature_tree.glb', scale: 1.35 };
    case 'BLOOMING':
      return { model: '/models/blooming_tree.glb', scale: 1.7 };
  }
};

const getStageFromStreak = (streak: number): GrowthStage => {
  if (streak >= 30) return 'BLOOMING';
  if (streak >= 14) return 'MATURE';
  if (streak >= 7) return 'SAPLING';
  if (streak >= 3) return 'SPROUT';
  return 'SEED';
};

const INITIAL_PLANTS: Plant[] = [
  {
    id: 'plant-1',
    speciesName: 'Sakura Bonsai',
    stage: 'SAPLING',
    position: [0, 0.4, 0],
    waterCount: 7,
    glbModelPath: '/models/sapling.glb',
    scaleMultiplier: 1.0,
  },
  {
    id: 'plant-2',
    speciesName: 'Sunburst Sunflower',
    stage: 'SPROUT',
    position: [-2.2, 0.35, 1.5],
    waterCount: 3,
    glbModelPath: '/models/sprout.glb',
    scaleMultiplier: 0.7,
  },
  {
    id: 'plant-3',
    speciesName: 'Zen Pine',
    stage: 'MATURE',
    position: [2.2, 0.35, 1.5],
    waterCount: 15,
    glbModelPath: '/models/mature_tree.glb',
    scaleMultiplier: 1.35,
  },
];

const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    title: 'Morning Hydration (1L Water)',
    category: 'Health',
    streak: 8,
    completedToday: false,
    assignedPlantId: 'plant-1',
  },
  {
    id: 'habit-2',
    title: '30 Mins Daily Workout',
    category: 'Fitness',
    streak: 4,
    completedToday: false,
    assignedPlantId: 'plant-2',
  },
  {
    id: 'habit-3',
    title: '15 Mins Mindful Meditation',
    category: 'Mindfulness',
    streak: 16,
    completedToday: false,
    assignedPlantId: 'plant-3',
  },
];

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: INITIAL_HABITS,
      plants: INITIAL_PLANTS,
      waterDrops: 140,
      sunPoints: 95,
      userLevel: 3,
      environment: 'day',

      toggleHabit: (id: string) => {
        const { habits, plants, waterDrops, sunPoints } = get();

        const updatedHabits = habits.map((h) => {
          if (h.id !== id) return h;
          const isCompleting = !h.completedToday;
          const newStreak = isCompleting ? h.streak + 1 : Math.max(0, h.streak - 1);

          if (isCompleting) {
            confetti({
              particleCount: 60,
              spread: 60,
              origin: { y: 0.7 },
              colors: ['#34d399', '#fbbf24', '#f472b6', '#38bdf8'],
            });
          }

          return {
            ...h,
            completedToday: isCompleting,
            streak: newStreak,
          };
        });

        const targetHabit = updatedHabits.find((h) => h.id === id);
        let updatedPlants = plants;

        if (targetHabit && targetHabit.assignedPlantId) {
          updatedPlants = plants.map((p) => {
            if (p.id !== targetHabit.assignedPlantId) return p;

            const newStage = getStageFromStreak(targetHabit.streak);
            const { model, scale } = getGlbForStage(newStage);

            return {
              ...p,
              stage: newStage,
              waterCount: p.waterCount + 1,
              glbModelPath: model,
              scaleMultiplier: scale,
            };
          });
        }

        const isCompleting = targetHabit?.completedToday ?? false;

        set({
          habits: updatedHabits,
          plants: updatedPlants,
          waterDrops: isCompleting ? waterDrops + 25 : waterDrops,
          sunPoints: isCompleting ? sunPoints + 15 : sunPoints,
        });
      },

      addHabit: (title: string, category: string) => {
        const { habits, plants } = get();
        const habitId = `habit-${Date.now()}`;
        const plantId = `plant-${Date.now()}`;

        const gridPositions: [number, number, number][] = [
          [0, 0.4, 0],
          [-2.2, 0.35, 1.5],
          [2.2, 0.35, 1.5],
          [-1.8, 0.35, -2],
          [1.8, 0.35, -2],
          [0, 0.4, 3],
        ];

        const nextPos = gridPositions[plants.length % gridPositions.length];
        const { model, scale } = getGlbForStage('SEED');

        const newPlant: Plant = {
          id: plantId,
          speciesName: 'Sakura Seedling',
          stage: 'SEED',
          position: nextPos,
          waterCount: 0,
          glbModelPath: model,
          scaleMultiplier: scale,
        };

        const newHabit: Habit = {
          id: habitId,
          title,
          category,
          streak: 0,
          completedToday: false,
          assignedPlantId: plantId,
        };

        set({
          habits: [...habits, newHabit],
          plants: [...plants, newPlant],
        });
      },

      setEnvironment: (environment) => set({ environment }),

      resetAll: () => {
        set({
          habits: INITIAL_HABITS,
          plants: INITIAL_PLANTS,
          waterDrops: 140,
          sunPoints: 95,
          userLevel: 3,
          environment: 'day',
        });
      },
    }),
    {
      name: 'sprout-garden-nextjs-storage',
    }
  )
);
