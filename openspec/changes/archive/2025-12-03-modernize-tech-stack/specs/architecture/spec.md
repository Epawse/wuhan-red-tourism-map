## ADDED Requirements
### Requirement: Modern Web Architecture
The application SHALL be built using a modern Single Page Application (SPA) framework to ensure maintainability and performance.

#### Scenario: Development Environment
- **WHEN** a developer starts the project
- **THEN** it SHALL run a local development server with Hot Module Replacement (HMR) (e.g., Vite).

#### Scenario: Language Standard
- **WHEN** writing code
- **THEN** TypeScript SHALL be used for logic to ensure type safety.

### Requirement: Component-Based UI
The application UI SHALL be composed of modular, reusable components.

#### Scenario: Map Component
- **WHEN** displaying a map
- **THEN** a reusable `<MapContainer>` component SHALL be used, encapsulating Leaflet initialization and lifecycle management.

#### Scenario: Routing
- **WHEN** navigating between "Chapters" (e.g., 3-1 to 3-2)
- **THEN** the application SHALL update the view without a full page reload using client-side routing.
