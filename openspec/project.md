# Project Context

## Purpose
This is an undergraduate Map Cartography coursework project. The goal is to create an "Online Map Story" application. It visualizes spatial data and narratives using web mapping technologies.

## Tech Stack
- **Core**: HTML5, CSS3, JavaScript (ES5/ES6).
- **Libraries**:
  - **jQuery 3.5.1**: DOM manipulation and utility.
  - **Leaflet**: Core mapping library.
  - **Leaflet Plugins**: 
    - `L.Polyline.SnakeAnim` (Animation)
    - `Control.MiniMap` (Overview map)
    - `leaflet.ChineseTmsProviders` (Base maps)
    - `leaflet.magnifyingglass`
    - `leaflet.fullscreen`
  - **Proj4js**: Coordinate projection.
- **Data Formats**: CSV (`place.csv`, `route.csv`), GeoJSON (`featureCUG.geojson`, `wuhan.geojson`).

## Project Conventions

### Code Style
- **Structure**: Static website structure.
  - HTML files for pages/chapters (e.g., `3-1.html`, `index.html`).
  - `JS/` for scripts and libraries.
  - `CSS/` for styles.
  - `data/` for spatial data files.
- **Naming**: Kebab-case or snake_case for files preferred, though existing files use mixed styles (e.g., `featureCUG.geojson`, `3-1.html`).

### Architecture Patterns
- Client-side rendering only.
- No backend server; relies on browser parsing of local or relative path data.

## Domain Context
- **Map Story**: Combining narrative text/media with interactive map elements.
- **Visualization**: displaying routes, locations, and custom map layers (e.g., CUG feature layers).

## Important Constraints
- Must run in a standard web browser.
- Coursework environment: likely no complex build tools (Webpack/Vite) used currently, simple script tags preferred.