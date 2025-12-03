# Change: Modernize Tech Stack

## Why
The current project utilizes a legacy stack (HTML, jQuery, direct script tags) which limits maintainability, code reuse, and developer experience. Navigating between chapters causes full page reloads, breaking the immersion of the "Map Story".

## What Changes
- **Framework**: Migrate from vanilla HTML/jQuery to **Vue 3** (Composition API).
- **Build Tool**: Adopt **Vite** for instant dev server start and optimized production builds.
- **Language**: Enforce **TypeScript** for better type safety (especially for GeoJSON and Map data).
- **Routing**: Implement **Vue Router** to turn the multi-page site into a Single Page Application (SPA).
- **State Management**: Use **Pinia** to manage map state (zoom, center, active layers) across story chapters.
- **Structure**: Reorganize code into reusable components (e.g., `<MapContainer />`, `<StoryPanel />`).

## Impact
- **Affected Specs**: Architecture, User Interface.
- **Affected Code**:
    - All `.html` files will be converted to Vue Views/Components.
    - `JS/` folder contents will be modularized or replaced by npm packages.
    - `CSS/` will be scoped to components or global styles.
    - `data/` files will be moved to `public/` or imported as assets.
