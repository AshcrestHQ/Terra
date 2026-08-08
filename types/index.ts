export type HabitCategory = 'Mindfulness' | 'Fitness' | 'Learning' | 'Health' | 'Productivity' | 'Creative';

export type PlantStage = 0 | 1 | 2 | 3 | 4; // 0: Seed, 1: Sprout, 2: Sapling, 3: Mature, 4: Blooming/Mythic

export type EnvironmentTheme = 'day' | 'sunset' | 'night';
export type WeatherType = 'sunny' | 'rain' | 'magic';

export interface PlantSpecies {
  id: string;
  name: string;
  description: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  waterCost: number;
  sunCost: number;
  requiredLevel: number;
  color: string;
  iconName: string;
}

export interface PlantInstance {
  id: string;
  speciesId: string;
  habitId?: string; // Linked habit ID if any
  stage: PlantStage;
  position: [number, number, number]; // 3D grid position
  health: number; // 0 - 100
  waterCount: number;
  plantedAt: string;
  lastWatered?: string;
}

export interface Habit {
  id: string;
  title: string;
  category: HabitCategory;
  frequency: 'daily' | 'weekly';
  waterReward: number;
  sunReward: number;
  assignedPlantId?: string;
  streak: number;
  bestStreak: number;
  completedToday: boolean;
  history: string[]; // List of YYYY-MM-DD dates
}

export interface GardenState {
  userLevel: number;
  currentXP: number;
  requiredXP: number;
  waterDrops: number;
  sunPoints: number;
  environment: EnvironmentTheme;
  weather: WeatherType;
  soundEnabled: boolean;
  unlockedSpecies: string[];
  selectedPlantId: string | null;
}

export const PLANT_SPECIES_LIST: PlantSpecies[] = [
  {
    id: 'sprout',
    name: 'Verdant Sprout',
    description: 'A resilient tiny seedling full of potential.',
    rarity: 'Common',
    waterCost: 10,
    sunCost: 5,
    requiredLevel: 1,
    color: '#34d399',
    iconName: 'Sprout',
  },
  {
    id: 'sunflower',
    name: 'Sunburst Sunflower',
    description: 'Radiates warmth and turns towards positivity.',
    rarity: 'Common',
    waterCost: 25,
    sunCost: 15,
    requiredLevel: 1,
    color: '#fbbf24',
    iconName: 'Sun',
  },
  {
    id: 'bonsai',
    name: 'Zen Bonsai Tree',
    description: 'Embodiment of patience, discipline, and calm mind.',
    rarity: 'Rare',
    waterCost: 50,
    sunCost: 30,
    requiredLevel: 2,
    color: '#10b981',
    iconName: 'Trees',
  },
  {
    id: 'rose',
    name: 'Velvet Rose Bush',
    description: 'Vibrant crimson blooms symbolizing passion and habit mastery.',
    rarity: 'Rare',
    waterCost: 75,
    sunCost: 50,
    requiredLevel: 3,
    color: '#f43f5e',
    iconName: 'Flower2',
  },
  {
    id: 'cherry',
    name: 'Sakura Blossom Tree',
    description: 'Drops soft glowing pink petals with every breeze.',
    rarity: 'Epic',
    waterCost: 120,
    sunCost: 80,
    requiredLevel: 4,
    color: '#f472b6',
    iconName: 'Sparkles',
  },
  {
    id: 'cactus',
    name: 'Prism Desert Cactus',
    description: 'Thrives on consistent daily discipline and endurance.',
    rarity: 'Rare',
    waterCost: 80,
    sunCost: 60,
    requiredLevel: 5,
    color: '#06b6d4',
    iconName: 'Flame',
  },
  {
    id: 'crystal',
    name: 'Astral Crystal Flora',
    description: 'Mystical plant grown from cosmic focus and deep streaks.',
    rarity: 'Epic',
    waterCost: 200,
    sunCost: 150,
    requiredLevel: 6,
    color: '#a855f7',
    iconName: 'Gem',
  },
  {
    id: 'goldenoak',
    name: 'Legendary Golden Oak',
    description: 'The pinnacle of habit achievement. Illuminates the whole island.',
    rarity: 'Legendary',
    waterCost: 400,
    sunCost: 300,
    requiredLevel: 8,
    color: '#eab308',
    iconName: 'Crown',
  },
];
