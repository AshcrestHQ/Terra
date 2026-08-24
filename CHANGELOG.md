# Changelog

All notable changes to the **Terra** 3D Habit Tracker project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-08-08

### Added
- **App Router Migration**: Complete transition to Next.js 14 App Router architecture.
- **Plant Nursery & Shop System**: Ability to unlock and nurture distinct 3D plant species (Oak, Bonsai, Lavender, Golden Fern, Sylvan Moss).
- **Gamification & Streak Decay Engine**: Daily habit tracking logic with procedural growth stage scaling (`SEED` -> `SPROUT` -> `SAPLING` -> `MATURE` -> `BLOOMING`) and health decay penalties for missed habit days.
- **Glassmorphic HUD Overlays**: Redesigned UI modals for Habit creation, Analytics dashboard, and Plant details with translucent glassmorphic visuals and Framer Motion fluid animations.
- **Dynamic Weather System**: Toggleable particle systems for Sunny, Rain, and Snow weather environments.
- **Capacitor Mobile Support**: Mobile native wrapping support for iOS and Android.
- **PWA Capabilities**: Service worker offline asset caching (`sw.js`) and web app manifest configuration (`manifest.json`).

### Changed
- Refactored state management to unified `GardenContext` with local storage persistence.
- Optimized 3D mesh rendering performance for low-poly floating island models.

---

## [1.0.5] - 2026-07-28

### Fixed
- Fixed SSR hydration mismatch error on `PlantDetailsModal`.
- Resolved touch control gesture scaling issue on mobile devices.

---

## [1.0.4] - 2026-07-15

### Added
- Analytics Modal tracking weekly habit velocity and streak history.
- Confetti celebration effects upon habit completion (`canvas-confetti`).

---

## [1.0.3] - 2026-06-30

### Improved
- Camera orbit controls smooth dampening and boundary constraints.
- Optimized GLTF 3D plant loader cache.

---

## [1.0.2] - 2026-06-12

### Fixed
- LocalStorage state serialization bug on fresh browser sessions.

---

## [1.0.1] - 2026-05-25

### Added
- Responsive HUD layout scaling for mobile screens.

---

## [1.0.0] - 2026-05-10

### Added
- Initial release of **Terra** 3D Habit Tracker with React Three Fiber floating island scene.
