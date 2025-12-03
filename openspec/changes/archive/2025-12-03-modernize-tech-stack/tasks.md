## 1. Environment Setup
- [ ] 1.1 Initialize Vue 3 + TypeScript + Vite project.
- [ ] 1.2 Install dependencies: `leaflet`, `vue-router`, `pinia`, `@types/leaflet`, `papaparse` (for CSV).
- [ ] 1.3 Configure `tsconfig.json` and `vite.config.ts` (alias setup).
- [ ] 1.4 Setup ESLint and Prettier.

## 2. Core Architecture
- [ ] 2.1 Create `src/components/MapContainer.vue` (Base Leaflet wrapper).
- [ ] 2.2 Create `src/stores/mapStore.ts` (Pinia store for map state).
- [ ] 2.3 Setup `src/router/index.ts` with routes for Home and Chapters.
- [ ] 2.4 Move assets:
    - `data/` -> `public/data/`
    - `CSS/images/` -> `src/assets/images/`
    - `JS/` (Plugins) -> `src/utils/leaflet-plugins/` or `public/scripts/` if necessary.

## 3. Feature Migration (Pilot)
- [ ] 3.1 Port `index.html` (Landing page) to `src/views/HomeView.vue`.
- [ ] 3.2 Port `3-1.html` logic to `src/views/ChapterView.vue` (or specific component).
    - Implement map initialization.
    - Load `featureCUG.geojson`.
    - Ensure `Control.MiniMap` works.

## 4. Asset & Plugin Integration
- [ ] 4.1 Create TypeScript shims (`.d.ts`) for non-typed Leaflet plugins.
- [ ] 4.2 Refactor `leaflet.ChineseTmsProviders.js` to be importable or load globally.
- [ ] 4.3 Refactor `L.Polyline.SnakeAnim.js` usage.

## 5. Full Migration & Cleanup
- [ ] 5.1 Define a data structure (JSON) to describe metadata for all chapters (3-1 to 3-25) to generate routes dynamically if possible.
- [ ] 5.2 Verify all chapters functionality.
- [ ] 5.3 Remove legacy root `.html`, `JS/`, `CSS/` folders (after backup).
