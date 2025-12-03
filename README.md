# Wuhan Red Tourism Map Story

This project is a web-based interactive map application designed to visualize "Red Tourism" routes in Wuhan. It combines narrative elements with spatial data to guide users through historical landmarks.

## Architecture

The application has been modernized from a static HTML/jQuery codebase to a Single Page Application (SPA) using the following technology stack:

- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Language**: TypeScript
- **Mapping Engine**: Leaflet (with GaoDe Satellite Tiles)
- **State Management**: Ref/Reactive (Vue Core)
- **Routing**: Vue Router
- **Data Handling**: PapaParse (CSV)

## Features

- **Interactive Map**: Full-screen satellite map with custom masking for Wuhan city.
- **Route Navigation**: Switch between different tourism routes via a floating header.
- **Points of Interest**: Detailed markers and descriptions for historical sites.
- **Path Visualization**: Animated snake-lines showing walking paths between locations (powered by Amap API).
- **Responsive UI**: Modern, card-based interface with glassmorphism effects and smooth transitions.

## Project Structure

```
src/
├── assets/             # Static images and icons
├── components/         # Reusable Vue components (MapContainer)
├── router/             # Routing configuration
├── types/              # TypeScript declarations
├── utils/              # Helper scripts and Leaflet plugins
├── views/              # Main application views (RedTourismView)
├── App.vue             # Root component
├── main.ts             # Entry point
└── style.css           # Global styles
public/
├── data/               # GeoJSON and CSV data files
└── images/             # Map assets
```

## Setup and Installation

Ensure you have Node.js (v18+) installed.

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Start development server**:
    ```bash
    npm run dev
    ```

3.  **Build for production**:
    ```bash
    npm run build
    ```
    The output will be located in the `dist/` directory.

## License

Coursework Project - China University of Geosciences (Wuhan).