# Change: Finalize Red Tourism App

## Why
The user has confirmed that the project scope is strictly the "Red Tourism" map story. The current setup includes placeholder code for other coursework chapters which is now unnecessary clutter.

## What Changes
- **Routing**: Make `RedTourismView` the root path (`/`).
- **Cleanup**: Remove `HomeView.vue`, `ChapterView.vue`, `chapters.ts`, and unused routes.
- **UI**: Optimize `RedTourismView` for full-screen standalone usage (removing back buttons or unrelated headers).

## Impact
- **Affected Specs**: User Interface, Architecture.
- **Affected Code**: `src/router/index.ts`, `src/views/*`, `src/data/*`.
