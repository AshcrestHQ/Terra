# Contributing to Terra

Thank you for your interest in contributing to **Terra**, the 3D habit-tracking garden! We welcome contributions from developers, 3D artists, designers, and enthusiasts of all skill levels.

---

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before getting started.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v20.0.0` or higher
- **npm**: `v10.0.0` or higher
- **Git**

### Local Setup

1. **Fork & Clone the Repository**
   ```bash
   git clone https://github.com/AshcrestHQ/Terra.git
   cd Terra
   ```

2. **Install Dependencies**
   ```bash
   npm ci
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Run Verification Commands**
   ```bash
   npm run lint
   npm run build
   ```

---

## 🌿 Workflow & Branching Strategy

- **`master`** is our main production branch. All releases and live deployments originate here.
- Create feature branches using descriptive names:
  - `feature/add-cactus-plant-model`
  - `fix/orbit-controls-touch-zoom`
  - `docs/update-architecture-diagram`

### Commit Message Guidelines

We follow Conventional Commits guidelines:
- `feat: add new weather particle type (cherry blossom)`
- `fix: resolve SSR hydration mismatch on PlantDetailsModal`
- `docs: update deployment steps in README`
- `style: format HabitList HUD overlay`
- `refactor: optimize 3D plant instancing logic`

---

## 🎨 Tech Stack & Architecture Standards

- **Framework**: Next.js 14+ (App Router, SSG output)
- **Language**: TypeScript (strict mode enabled)
- **3D Engine**: Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
- **State Management**: Zustand & React Context (`GardenContext`) with LocalStorage persistence
- **Styling**: Tailwind CSS with custom glassmorphism utilities & Framer Motion
- **Mobile Packaging**: Capacitor (`@capacitor/core`)

### 3D Asset Guidelines

- Place `.glb` / `.gltf` 3D assets in `/public/models/`.
- Ensure models are optimized (low-poly mesh, compressed textures) for WebGL mobile performance.
- Test 3D scenes across desktop and mobile aspect ratios.

---

## 🧪 Pull Request Guidelines

1. Ensure all code passes `npm run lint` and `npm run build` cleanly.
2. Provide a clear description of changes in your PR summary.
3. Attach screenshots or video clips if your PR changes UI components or 3D visuals.
4. Keep PRs focused on a single logical change or feature.

Thank you for helping grow the Terra ecosystem! 🌳
