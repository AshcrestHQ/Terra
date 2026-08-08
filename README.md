# Terra — 3D Habit Tracker Garden

Terra is a 3D habit-tracking garden built with Next.js, React Three Fiber, and Zustand. Every habit you keep grows a living plant through five stages — Seed, Sprout, Sapling, Mature, Blooming — set against a floating island scene with dynamic weather. Track streaks, view analytics, and watch consistency take root visually.

---

## 🚀 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **3D Graphics Engine**: React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`), Three.js
- **State Management**: React Context & Zustand (with local storage persistence)
- **Styling**: Tailwind CSS (Glassmorphism HUD overlays), Framer Motion (fluid animations)
- **Deployment Target**: Cloudflare Pages (Static Export)
- **Mobile Support**: Capacitor

---

## 📂 Project Structure

```text
├── app/
│   ├── globals.css          # Tailwind CSS global styles
│   ├── layout.tsx           # Next.js App Router root layout
│   └── page.tsx             # Main page combining 3D R3F Canvas & 2D Glass Overlay
├── components/
│   ├── canvas/
│   │   ├── GardenScene.tsx  # R3F Canvas, OrbitControls, Environment, 3D Plants
│   │   ├── FloatingIsland.tsx
│   │   └── WeatherParticles.tsx
│   └── ui/
│       ├── HabitModal.tsx   # Framer Motion animated glassmorphism modals
│       ├── HabitList.tsx
│       └── Navbar.tsx       
├── context/
│   └── GardenContext.tsx    # Core React Context for state, local storage sync, and gamification decay
├── public/
│   └── models/              # Local GLTF / GLB 3D plant model assets
├── types/
├── next.config.js           # Next.js config (output: 'export')
├── capacitor.config.ts      # Capacitor config pointing to 'out' directory
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🎮 Growth Stage Thresholds (Gamification Engine)

Every missed day results in a health penalty for your plant, while checking off habits builds streaks and advances growth stages:

| Habit Streak | Growth Stage | Model Loaded | Scale |
| :--- | :--- | :--- | :--- |
| **0 – 2 Days** | `SEED` | `/models/seed.glb` | `0.45x` |
| **3 – 6 Days** | `SPROUT` | `/models/sprout.glb` | `0.70x` |
| **7 – 13 Days** | `SAPLING` | `/models/sapling.glb` | `1.00x` |
| **14 – 29 Days** | `MATURE` | `/models/mature_tree.glb` | `1.35x` |
| **30+ Days** | `BLOOMING` | `/models/blooming_tree.glb` | `1.70x` |

---

## ⚡ Development & Deployment

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Next.js development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Cloudflare Pages Deployment (Static Export)

Terra is configured as a Static Site Generator (SSG) via `output: 'export'` in `next.config.js`.

**Automatic GitHub Deploy (Recommended):**
1. Push this repository to GitHub.
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) -> **Workers & Pages**.
3. Create a **Pages** application and connect your repository.
4. Framework preset: **Next.js (Static HTML Export)**
5. Build command: `npm run build`
6. Build output directory: `out`
7. Click **Deploy**!

**Manual Deploy via Wrangler CLI:**
```bash
npm run build
npx wrangler pages deploy out --project-name terra
```

### Mobile App (Capacitor)

Terra fully supports wrapping as a native iOS/Android app via Capacitor. Because it is statically exported, Capacitor can read the `out/` directory directly.

1. Build the web app:
   ```bash
   npm run build
   ```
2. Sync with Capacitor (ensure iOS/Android platforms are added):
   ```bash
   npx cap sync
   ```
3. Open in IDE:
   ```bash
   npx cap open ios
   npx cap open android
   ```
