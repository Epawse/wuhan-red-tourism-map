## Context
The existing project is a collection of static HTML files using Leaflet and jQuery. We need to transform this into a modern Vue 3 application without losing the visual fidelity or data of the original coursework.

## Goals / Non-Goals
- **Goals**:
  - Create a performant SPA.
  - Decouple data (GeoJSON/CSV) from view logic.
  - Create a reusable Map component that handles Leaflet lifecycle.
- **Non-Goals**:
  - We will NOT replace Leaflet with a different map engine (e.g., Mapbox) to preserve existing plugins and logic.
  - We will NOT build a backend API; data will remain static JSON/CSV files.

## Decisions
- **Decision**: Use **Composition API** (`<script setup>`).
  - **Why**: Better logic reuse (composables for map behaviors) and TypeScript inference.
- **Decision**: **Leaflet as a Side Effect**.
  - **Why**: Leaflet manipulates the DOM directly. We will wrap it in a `onMounted` hook within a Vue component and expose the instance via refs/store, rather than using a wrapper library (like `vue-leaflet`) which might limit access to raw plugin APIs needed for this legacy code.
- **Decision**: **Asset Placement**.
  - **Why**: Large GeoJSON files and CSVs will be placed in `public/` to be fetched via `fetch()`, mimicking the current AJAX behavior, rather than bundled into the JS chunk (unless small).

## Risks / Trade-offs
- **Risk**: Legacy Leaflet plugins (e.g., `L.Polyline.SnakeAnim`) might not have TypeScript definitions or ESM exports.
  - **Mitigation**: We may need to write simple shim declarations (`.d.ts`) or import them as side-effect scripts.

## Migration Plan
1. **Scaffold**: `npm create vite@latest` in the root (or a temporary `src_new` folder then move).
2. **Shim**: Ensure legacy scripts (`leaflet.ChineseTmsProviders.js`, etc.) load correctly in the Vue environment.
3. **Port**: Convert `index.html` to `App.vue` + `Home.vue`.
4. **Iterate**: Convert chapters 3-1 to 3-25 into dynamic routes or individual components.
