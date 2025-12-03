import * as L from 'leaflet';

declare module 'leaflet' {
  namespace tileLayer {
    function chinaProvider(type: string, options?: any): L.TileLayer;
  }

  interface Polyline {
    snakeIn(): void;
  }

  interface LayerGroup {
    snakeIn(): void;
  }
  
  namespace Control {
      class MiniMap extends L.Control {
          constructor(layer: L.Layer, options?: any);
      }
  }
  namespace control {
      function minimap(layer: L.Layer, options?: any): L.Control.MiniMap;
  }
}
