## MODIFIED Requirements
### Requirement: Modern Web Architecture
The application SHALL be built using a modern Single Page Application (SPA) framework to ensure maintainability and performance.

#### Scenario: Development Environment
- **WHEN** a developer starts the project
- **THEN** it SHALL run a local development server with Hot Module Replacement (HMR) (e.g., Vite).

#### Scenario: Language Standard
- **WHEN** writing code
- **THEN** TypeScript SHALL be used for logic to ensure type safety.

## REMOVED Requirements
### Requirement: Component-Based UI
The application UI SHALL be composed of modular, reusable components.

#### Scenario: Routing
**Reason**: The application is now a single-view tool; complex client-side routing between chapters is no longer required.
**Migration**: The main view will be loaded at the root path.
