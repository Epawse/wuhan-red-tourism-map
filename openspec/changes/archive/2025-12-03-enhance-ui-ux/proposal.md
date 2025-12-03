# Change: Enhance UI/UX

## Why
The current UI is a direct port of a legacy coursework design. It lacks modern visual hierarchy, responsiveness, and polish. The color palette is functional but dated, and interactions are abrupt. We want to leverage Vue 3's capabilities to create a smooth, professional "Map Story" experience.

## What Changes
- **Visual Design**: Adopt a modern "Card-based" layout with a cohesive color palette (keeping the "Red Tourism" theme but refining it).
- **Typography**: Upgrade fonts for better readability and Chinese character support.
- **Animations**: Add subtle transitions for hover states, panel sliding, and map interactions.
- **Layout**:
    - Transform the top navigation into a floating header or a cleaner tab bar.
    - Improve the sidebar list with better item spacing and active states.
    - Make the "Description" panel more readable, perhaps as an overlay or a drawer on smaller screens.
- **Map Controls**: Style the custom Zoom controls and Layer toggles to match the new theme.
- **Responsive**: Ensure the layout adapts gracefully to different screen sizes (though primarily desktop-focused).

## Impact
- **Affected Specs**: UI Design, User Experience.
- **Affected Code**: `src/views/RedTourismView.vue`, `src/style.css`.
