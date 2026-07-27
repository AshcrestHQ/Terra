# Sprout & Flourish — 3D Habit Tracker Garden (Next.js & Vercel)

A 3D Habit Tracker web application built with **Next.js (App Router), TypeScript, React Three Fiber (@react-three/fiber), Drei (@react-three/drei), Three.js, Zustand, and Tailwind CSS**, optimized for instant 1-click deployment on **Vercel**.

Every daily goal you check off nurtures your virtual 3D garden island. Habit streaks automatically advance 3D plant growth stages (`SEED` → `SPROUT` → `SAPLING` → `MATURE` → `BLOOMING`).

---

## 🚀 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **3D Graphics Engine**: React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`), Three.js
- **State Management**: Zustand (with local storage persistence)
- **Styling**: Tailwind CSS (Glassmorphism HUD overlays)
- **Deployment Target**: Vercel

---

## 📂 Project Structure

```text
├── app/
│   ├── globals.css          # Tailwind CSS global styles
│   ├── layout.tsx           # Next.js App Router root layout
│   └── page.tsx             # Main page combining 3D R3F Canvas & 2D Glass Overlay
├── components/
│   ├── canvas/
│   │   └── GardenScene.tsx  # R3F Canvas, OrbitControls, Environment, 3D Plants
│   └── ui/
│       └── HabitOverlay.tsx # Glassmorphism HUD checklist & streak stats
├── store/
│   └── useHabitStore.ts     # Zustand state store for habits, streaks & 3D growth stages
├── public/
│   └── models/              # Local GLTF / GLB 3D plant model assets
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🎮 Growth Stage Thresholds (Zustand State Engine)

| Habit Streak | Growth Stage | Model Loaded | Scale |
| :--- | :--- | :--- | :--- |
| **0 – 2 Days** | `SEED` | `/models/seed.glb` | `0.45x` |
| **3 – 6 Days** | `SPROUT` | `/models/sprout.glb` | `0.70x` |
| **7 – 13 Days** | `SAPLING` | `/models/sapling.glb` | `1.00x` |
| **14 – 29 Days** | `MATURE` | `/models/mature_tree.glb` | `1.35x` |
| **30+ Days** | `BLOOMING` | `/models/blooming_tree.glb` | `1.70x` |

---

## ⚡ Deployment to Vercel

### Option 1: 1-Click Vercel CLI Deployment
```bash
npm install -g vercel
vercel
```

### Option 2: GitHub Repository Import
1. Push this repository to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Click **Import Repository** → Select `sprout-flourish-3d-garden`.
4. Click **Deploy**!
