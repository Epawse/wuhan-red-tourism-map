<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet's default icon path issues with bundlers
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})
L.Marker.prototype.options.icon = DefaultIcon

const props = withDefaults(defineProps<{
  center?: [number, number]
  zoom?: number
}>(), {
  center: () => [30.52, 114.36], // Wuhan default
  zoom: 11
})

const emit = defineEmits<{
  (e: 'map-ready', map: L.Map): void
}>()

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null

onMounted(() => {
  if (mapContainer.value) {
    map = L.map(mapContainer.value, {
      zoomControl: false // We might want to add custom controls
    }).setView(
      props.center,
      props.zoom
    )
    
    L.control.zoom({ position: 'bottomright' }).addTo(map)

    // Default layer (OSM for now, will replace with ChineseTmsProviders later)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    emit('map-ready', map)
  }
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  z-index: 1;
}
</style>
