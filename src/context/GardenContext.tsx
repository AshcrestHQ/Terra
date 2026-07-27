import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type {
  Habit,
  PlantInstance,
  GardenState,
  HabitCategory,
  EnvironmentTheme,
  WeatherType,
} from '../types';
import { PLANT_SPECIES_LIST } from '../types';
import { soundManager } from '../utils/audio';

interface GardenContextType {
  habits: Habit[];
  plants: PlantInstance[];
  state: GardenState;
  completeHabit: (habitId: string) => void;
  addHabit: (title: string, category: HabitCategory, frequency: 'daily' | 'weekly', speciesId: string) => void;
  deleteHabit: (habitId: string) => void;
  buyPlant: (speciesId: string) => boolean;
  waterPlantDirectly: (plantId: string) => boolean;
  setEnvironment: (env: EnvironmentTheme) => void;
  setWeather: (weather: WeatherType) => void;
  toggleSound: () => void;
  setSelectedPlantId: (plantId: string | null) => void;
  exportData: () => void;
  importData: (jsonStr: string) => boolean;
  resetData: () => void;
}

const DEFAULT_PLANT_GRID: [number, number, number][] = [
  [0, 0.4, 0],
  [-2.2, 0.35, 1.5],
  [2.2, 0.35, 1.5],
  [-1.8, 0.35, -2],
  [1.8, 0.35, -2],
  [-3.2, 0.3, -0.5],
  [3.2, 0.3, -0.5],
  [0, 0.4, 3],
  [0, 0.35, -3.5],
  [-2.8, 0.3, 3.2],
  [2.8, 0.3, 3.2],
  [-3.8, 0.25, 1.2],
  [3.8, 0.25, 1.2],
];

const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    title: 'Morning Hydration (1L Water)',
    category: 'Health',
    frequency: 'daily',
    waterReward: 25,
    sunReward: 15,
    assignedPlantId: 'plant-1',
    streak: 3,
    bestStreak: 5,
    completedToday: false,
    history: ['2026-07-25', '2026-07-26'],
  },
  {
    id: 'habit-2',
    title: '30 Mins Workout / Walk',
    category: 'Fitness',
    frequency: 'daily',
    waterReward: 35,
    sunReward: 25,
    assignedPlantId: 'plant-2',
    streak: 2,
    bestStreak: 7,
    completedToday: false,
    history: ['2026-07-26'],
  },
  {
    id: 'habit-3',
    title: '15 Mins Mindful Meditation',
    category: 'Mindfulness',
    frequency: 'daily',
    waterReward: 30,
    sunReward: 20,
    assignedPlantId: 'plant-3',
    streak: 4,
    bestStreak: 4,
    completedToday: false,
    history: ['2026-07-24', '2026-07-25', '2026-07-26'],
  },
];

const INITIAL_PLANTS: PlantInstance[] = [
  {
    id: 'plant-1',
    speciesId: 'sprout',
    habitId: 'habit-1',
    stage: 2,
    position: DEFAULT_PLANT_GRID[0],
    health: 95,
    waterCount: 4,
    plantedAt: '2026-07-20',
  },
  {
    id: 'plant-2',
    speciesId: 'sunflower',
    habitId: 'habit-2',
    stage: 1,
    position: DEFAULT_PLANT_GRID[1],
    health: 88,
    waterCount: 2,
    plantedAt: '2026-07-22',
  },
  {
    id: 'plant-3',
    speciesId: 'bonsai',
    habitId: 'habit-3',
    stage: 3,
    position: DEFAULT_PLANT_GRID[2],
    health: 100,
    waterCount: 7,
    plantedAt: '2026-07-18',
  },
];

const INITIAL_STATE: GardenState = {
  userLevel: 2,
  currentXP: 140,
  requiredXP: 250,
  waterDrops: 120,
  sunPoints: 85,
  environment: 'day',
  weather: 'sunny',
  soundEnabled: true,
  unlockedSpecies: ['sprout', 'sunflower', 'bonsai'],
  selectedPlantId: null,
};

const GardenContext = createContext<GardenContextType | undefined>(undefined);

export const GardenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('garden_habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  const [plants, setPlants] = useState<PlantInstance[]>(() => {
    const saved = localStorage.getItem('garden_plants');
    return saved ? JSON.parse(saved) : INITIAL_PLANTS;
  });

  const [state, setState] = useState<GardenState>(() => {
    const saved = localStorage.getItem('garden_state');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  // LocalStorage Sync
  useEffect(() => {
    localStorage.setItem('garden_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('garden_plants', JSON.stringify(plants));
  }, [plants]);

  useEffect(() => {
    localStorage.setItem('garden_state', JSON.stringify(state));
  }, [state]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#34d399', '#fbbf24', '#f472b6', '#38bdf8'],
    });
  };

  const checkLevelUp = (currentXP: number, requiredXP: number, currentLevel: number) => {
    if (currentXP >= requiredXP) {
      const newLevel = currentLevel + 1;
      const nextRequired = Math.floor(requiredXP * 1.5);
      const remainingXP = currentXP - requiredXP;

      soundManager.playLevelUpSound();
      triggerConfetti();

      // Check if new species unlock
      const newlyUnlocked = PLANT_SPECIES_LIST.filter((s) => s.requiredLevel <= newLevel).map((s) => s.id);

      setState((prev) => ({
        ...prev,
        userLevel: newLevel,
        currentXP: remainingXP,
        requiredXP: nextRequired,
        unlockedSpecies: Array.from(new Set([...prev.unlockedSpecies, ...newlyUnlocked])),
      }));
    }
  };

  const completeHabit = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];

    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;

        const isCompleting = !h.completedToday;
        const newStreak = isCompleting ? h.streak + 1 : Math.max(0, h.streak - 1);
        const newBestStreak = Math.max(h.bestStreak, newStreak);
        const newHistory = isCompleting
          ? Array.from(new Set([...h.history, today]))
          : h.history.filter((d) => d !== today);

        if (isCompleting) {
          soundManager.playHabitCompleteSound();
          soundManager.playWateringSound();
          triggerConfetti();

          // Reward water & sun & XP
          const xpGain = 40 + h.streak * 5;
          const newWater = state.waterDrops + h.waterReward;
          const newSun = state.sunPoints + h.sunReward;
          const newXP = state.currentXP + xpGain;

          setState((st) => ({
            ...st,
            waterDrops: newWater,
            sunPoints: newSun,
            currentXP: newXP,
          }));

          checkLevelUp(newXP, state.requiredXP, state.userLevel);

          // Grow assigned plant if present
          if (h.assignedPlantId) {
            setPlants((pList) =>
              pList.map((p) => {
                if (p.id !== h.assignedPlantId) return p;
                const newWaterCount = p.waterCount + 1;
                // Stage calculation: 0->1 at 1 water, 1->2 at 3 water, 2->3 at 6 water, 3->4 at 10 water
                let newStage = p.stage;
                if (newWaterCount >= 10) newStage = 4;
                else if (newWaterCount >= 6) newStage = 3;
                else if (newWaterCount >= 3) newStage = 2;
                else if (newWaterCount >= 1) newStage = 1;

                return {
                  ...p,
                  waterCount: newWaterCount,
                  stage: newStage,
                  health: Math.min(100, p.health + 10),
                  lastWatered: today,
                };
              })
            );
          }
        }

        return {
          ...h,
          completedToday: isCompleting,
          streak: newStreak,
          bestStreak: newBestStreak,
          history: newHistory,
        };
      })
    );
  };

  const addHabit = (
    title: string,
    category: HabitCategory,
    frequency: 'daily' | 'weekly',
    speciesId: string
  ) => {
    const habitId = `habit-${Date.now()}`;
    const plantId = `plant-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];

    // Find next position
    const usedPosIndices = plants.map((p) =>
      DEFAULT_PLANT_GRID.findIndex((pos) => pos[0] === p.position[0] && pos[2] === p.position[2])
    );
    let nextIndex = DEFAULT_PLANT_GRID.findIndex((_, idx) => !usedPosIndices.includes(idx));
    if (nextIndex === -1) nextIndex = plants.length % DEFAULT_PLANT_GRID.length;

    const newPosition = DEFAULT_PLANT_GRID[nextIndex];

    const newPlant: PlantInstance = {
      id: plantId,
      speciesId,
      habitId,
      stage: 1,
      position: newPosition,
      health: 100,
      waterCount: 0,
      plantedAt: today,
    };

    const newHabit: Habit = {
      id: habitId,
      title,
      category,
      frequency,
      waterReward: 30,
      sunReward: 20,
      assignedPlantId: plantId,
      streak: 0,
      bestStreak: 0,
      completedToday: false,
      history: [],
    };

    setPlants((prev) => [...prev, newPlant]);
    setHabits((prev) => [...prev, newHabit]);
    soundManager.playPlantUnlockSound();
  };

  const deleteHabit = (habitId: string) => {
    const targetHabit = habits.find((h) => h.id === habitId);
    if (targetHabit?.assignedPlantId) {
      setPlants((prev) => prev.filter((p) => p.id !== targetHabit.assignedPlantId));
    }
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    soundManager.playClickSound();
  };

  const buyPlant = (speciesId: string): boolean => {
    const species = PLANT_SPECIES_LIST.find((s) => s.id === speciesId);
    if (!species) return false;

    if (state.waterDrops < species.waterCost || state.sunPoints < species.sunCost) {
      return false;
    }

    // Deduct cost
    setState((prev) => ({
      ...prev,
      waterDrops: prev.waterDrops - species.waterCost,
      sunPoints: prev.sunPoints - species.sunCost,
    }));

    // Find position
    const usedPosIndices = plants.map((p) =>
      DEFAULT_PLANT_GRID.findIndex((pos) => pos[0] === p.position[0] && pos[2] === p.position[2])
    );
    let nextIndex = DEFAULT_PLANT_GRID.findIndex((_, idx) => !usedPosIndices.includes(idx));
    if (nextIndex === -1) nextIndex = plants.length % DEFAULT_PLANT_GRID.length;

    const newPlant: PlantInstance = {
      id: `plant-${Date.now()}`,
      speciesId,
      stage: 1,
      position: DEFAULT_PLANT_GRID[nextIndex],
      health: 100,
      waterCount: 1,
      plantedAt: new Date().toISOString().split('T')[0],
    };

    setPlants((prev) => [...prev, newPlant]);
    soundManager.playPlantUnlockSound();
    triggerConfetti();
    return true;
  };

  const waterPlantDirectly = (plantId: string): boolean => {
    if (state.waterDrops < 15) return false;

    setState((prev) => ({ ...prev, waterDrops: prev.waterDrops - 15 }));
    soundManager.playWateringSound();

    setPlants((prev) =>
      prev.map((p) => {
        if (p.id !== plantId) return p;
        const newWater = p.waterCount + 1;
        let newStage = p.stage;
        if (newWater >= 10) newStage = 4;
        else if (newWater >= 6) newStage = 3;
        else if (newWater >= 3) newStage = 2;
        else if (newWater >= 1) newStage = 1;

        return {
          ...p,
          waterCount: newWater,
          stage: newStage,
          health: 100,
        };
      })
    );
    return true;
  };

  const setEnvironment = (environment: EnvironmentTheme) => {
    setState((prev) => ({ ...prev, environment }));
    soundManager.playClickSound();
  };

  const setWeather = (weather: WeatherType) => {
    setState((prev) => ({ ...prev, weather }));
    soundManager.playClickSound();
  };

  const toggleSound = () => {
    const nextSound = !state.soundEnabled;
    setState((prev) => ({ ...prev, soundEnabled: nextSound }));
    soundManager.setMuted(!nextSound);
  };

  const setSelectedPlantId = (plantId: string | null) => {
    setState((prev) => ({ ...prev, selectedPlantId: plantId }));
  };

  const exportData = () => {
    const exportObj = { habits, plants, state };
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `garden-habits-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.habits && parsed.plants && parsed.state) {
        setHabits(parsed.habits);
        setPlants(parsed.plants);
        setState(parsed.state);
        soundManager.playLevelUpSound();
        return true;
      }
    } catch {
      return false;
    }
    return false;
  };

  const resetData = () => {
    setHabits(INITIAL_HABITS);
    setPlants(INITIAL_PLANTS);
    setState(INITIAL_STATE);
    localStorage.clear();
  };

  return (
    <GardenContext.Provider
      value={{
        habits,
        plants,
        state,
        completeHabit,
        addHabit,
        deleteHabit,
        buyPlant,
        waterPlantDirectly,
        setEnvironment,
        setWeather,
        toggleSound,
        setSelectedPlantId,
        exportData,
        importData,
        resetData,
      }}
    >
      {children}
    </GardenContext.Provider>
  );
};

export const useGarden = () => {
  const context = useContext(GardenContext);
  if (!context) {
    throw new Error('useGarden must be used within a GardenProvider');
  }
  return context;
};
