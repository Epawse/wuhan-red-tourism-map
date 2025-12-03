<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef } from 'vue'
import L from 'leaflet'
import Papa from 'papaparse'
import '@/utils/leaflet-plugins/leaflet.ChineseTmsProviders.js'
import '@/utils/leaflet-plugins/L.Polyline.SnakeAnim.js'
import '@/utils/leaflet-plugins/leaflet.mask.js'

// Interfaces
interface RouteInfo {
  id: string
  name: string
  detail: string // "PlaceA—PlaceB"
  desc: string
}

interface PlaceInfo {
  id: string
  name: string
  lng: number
  lat: number
  desc: string
}

// State
const mapContainer = ref<HTMLElement | null>(null)
const map = shallowRef<L.Map | null>(null)

const routes = ref<Record<string, RouteInfo>>({})
const places = ref<Record<string, PlaceInfo>>({})
const selectedRouteId = ref<string | null>(null)
const selectedPlaceName = ref<string | null>(null)

// UI Helper State
const sidebarButtons = ref<string[]>([]) // List of place names for current route
const currentRouteDesc = ref<string>('')
const currentPlaceDesc = ref<string>('')

// Layer Refs
const markers = shallowRef<L.Marker[]>([])
const currentPath = shallowRef<L.Polyline | null>(null)
const maskLayer = shallowRef<L.Layer | null>(null)

// Map Initialization
onMounted(async () => {
  if (!mapContainer.value) return

  // Init Map
  const m = L.map(mapContainer.value, {
    center: [30.55, 114.3],
    zoom: 10,
    zoomControl: false
  })
  map.value = m
  
  L.control.zoom({ position: 'topright' }).addTo(m)

  // Layers
  // @ts-ignore: Custom plugin usage
  L.tileLayer.chinaProvider("GaoDe.Satellite.Map", {
    maxZoom: 20,
    minZoom: 5,
  }).addTo(m)

  // @ts-ignore
  L.tileLayer.chinaProvider("GaoDe.Satellite.Annotion", {
    maxZoom: 20,
    minZoom: 5,
  }).addTo(m)

  // Mask
  // @ts-ignore
  maskLayer.value = L.mask("/data/wuhan.geojson", {
    fillOpacity: 0.5,
  }).addTo(m)

  // Load Data
  await loadData()
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
    map.value = null
  }
})

// Data Loading
async function loadData() {
  // Load Routes
  Papa.parse('/data/route.csv', {
    download: true,
    complete: (results) => {
      const data = results.data as string[][]
      // Skip header (row 0)
      for (let i = 1; i < data.length; i++) {
        const row = data[i]
        if (!row || row.length < 4) continue
        const id = row[0]
        const name = row[1]
        const detail = row[2]
        const desc = row[3]
        if (!id || !name || !detail || !desc) continue
        routes.value[id] = { id, name, detail, desc }
      }
    }
  })

  // Load Places
  Papa.parse('/data/place.csv', {
    download: true,
    complete: (results) => {
      const data = results.data as string[][]
      for (let i = 1; i < data.length; i++) {
        const row = data[i]
        if (!row || row.length < 5) continue
        const id = row[0]
        const name = row[1]
        const lng = row[2]
        const lat = row[3]
        const desc = row[4]
        if (!id || !name || !lng || !lat || !desc) continue
        
        places.value[name] = { 
          id, 
          name, 
          lng: parseFloat(lng), 
          lat: parseFloat(lat), 
          desc 
        }
      }
    }
  })
}

// Interactions
function handleNavClick(routeId: string) {
  selectedRouteId.value = routeId
  const route = routes.value[routeId]
  if (!route) return
  
  // Update Sidebar
  sidebarButtons.value = route.detail.split('—')
  currentRouteDesc.value = route.desc
  
  // Reset Selection
  selectedPlaceName.value = null
  currentPlaceDesc.value = ''
  
  // Clear Path
  if (currentPath.value && map.value) {
    map.value.removeLayer(currentPath.value)
    currentPath.value = null
  }

  // Clear Markers
  markers.value.forEach(marker => marker.remove())
  markers.value = []

  if (!map.value) return

  // Add Markers
  const placeNames = route.detail.split('—')
  placeNames.forEach(name => {
    const place = places.value[name]
    if (!place) return

    const latlng = L.latLng(place.lat, place.lng)
    const marker = L.marker(latlng).addTo(map.value!)
    
    const markerIcon = L.divIcon({
        html: name,
        className: "my-div-icon",
        iconSize: [250, 70],
        iconAnchor: [-20, 40],
    })
    const textMarker = L.marker(latlng, { icon: markerIcon }).addTo(map.value!)
    
    markers.value.push(marker)
    markers.value.push(textMarker)
  })

  if (markers.value.length > 0) {
    map.value.fitBounds(L.featureGroup(markers.value).getBounds())
  }
}

function handleSideClick(placeName: string) {
  selectedPlaceName.value = placeName
  const place = places.value[placeName]
  if (place) {
    currentPlaceDesc.value = place.desc
    map.value?.setView([place.lat, place.lng], 18)
  }
}

function handleDrawPathClick() {
  if (!selectedRouteId.value || !map.value) return
  const route = routes.value[selectedRouteId.value]
  if (!route) return
  const placeNames = route.detail.split('—')
  
  // Clear existing path
  if (currentPath.value) {
    map.value.removeLayer(currentPath.value)
    currentPath.value = null
  }

  let allLatLngs: number[][] = []
  let currentIndex = 0

  const getPathRecursive = () => {
    if (currentIndex < placeNames.length - 1) {
      const currName = placeNames[currentIndex]
      const nextName = placeNames[currentIndex + 1]
      if (!currName || !nextName) {
        currentIndex++
        getPathRecursive()
        return
      }
      const curr = places.value[currName]
      const next = places.value[nextName]

      if (!curr || !next) {
        currentIndex++
        getPathRecursive()
        return
      }

      const url = `https://restapi.amap.com/v3/direction/walking?destination=${next.lng},${next.lat}&origin=${curr.lng},${curr.lat}&output=JSON&key=65e453b2952957e068ba517a7cf0f6ce`

      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data.route && data.route.paths) {
            const steps = data.route.paths[0].steps
            steps.forEach((step: any) => {
              const nodeArr = step.polyline.split(';')
              nodeArr.forEach((node: string) => {
                const [lngStr, latStr] = node.split(',')
                if (lngStr && latStr) {
                   const lng = parseFloat(lngStr)
                   const lat = parseFloat(latStr)
                   if (!isNaN(lat) && !isNaN(lng)) {
                      allLatLngs.push([lat, lng]) // Leaflet uses [lat, lng]
                   }
                }
              })
            })
          }
          currentIndex++
          getPathRecursive()
        })
        .catch(err => {
          console.error("Amap API Error", err)
          currentIndex++
          getPathRecursive()
        })
    } else {
      // Draw
      if (allLatLngs.length > 0) {
        // Full path for bounds
        const fullPath = L.polyline(allLatLngs as L.LatLngExpression[])
        map.value!.fitBounds(fullPath.getBounds())

        // Snake Animation
        const snakePath = L.polyline(allLatLngs as L.LatLngExpression[], {
          color: 'red',
          weight: 8,
          // @ts-ignore
          snakingSpeed: 200
        }).addTo(map.value!)
        
        // @ts-ignore
        snakePath.snakeIn()
        currentPath.value = snakePath
      }
    }
  }

  getPathRecursive()
}

</script>

<template>
  <div class="red-tourism-layout">
    <div class="title">武汉市红色旅游主题线路</div>
    
    <div class="nav">
      <button 
        v-for="(route, id) in routes" 
        :key="id"
        :class="{ active: selectedRouteId === id }"
        @click="handleNavClick(id as string)"
      >
        {{ route.name }}
      </button>
    </div>

    <div class="main-container">
      <div class="sidebar">
        <button 
          v-for="name in sidebarButtons" 
          :key="name"
          :class="{ active: selectedPlaceName === name }"
          @click="handleSideClick(name)"
        >
          {{ name }}
        </button>
        <button v-if="selectedRouteId" class="draw-btn" @click="handleDrawPathClick">
          绘制轨迹线
        </button>
      </div>

      <div class="map-wrapper">
        <div ref="mapContainer" class="map-content"></div>
      </div>

      <div class="content-panel">
        <div v-if="selectedRouteId">
          <h3>线路描述：</h3>
          <p>{{ currentRouteDesc }}</p>
        </div>
        <div v-if="selectedPlaceName">
          <h3>景点描述：</h3>
          <p>{{ currentPlaceDesc }}</p>
        </div>
      </div>
    </div>

    <div class="footer">
      中国地质大学（武汉）数字制图学课程设计 <br />2024年1月 (Modernized 2025)
    </div>
  </div>
</template>

<style scoped>
.red-tourism-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  font-family: Arial, sans-serif;
  overflow: hidden;
}

.title {
  text-align: center;
  font-size: 24px; /* Scaled down a bit */
  padding: 10px;
  color: #f0e0b0;
  background-color: #ae3a1f;
  flex-shrink: 0;
}

.nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #cf4f3c;
  height: 50px;
  flex-shrink: 0;
}

.nav button {
  padding: 5px 15px;
  border: none;
  background-color: #f9f1e6;
  cursor: pointer;
  color: #ce6f57;
  border-radius: 10px;
  font-weight: bold;
}

.nav button:hover {
  background-color: #fae3df;
}

.nav button.active {
  background-color: #f6c8c0;
  color: #ae3a1f;
}

.main-container {
  display: flex;
  flex: 1;
  overflow: hidden; /* Map handles scrolling */
}

.sidebar {
  width: 20%;
  background-color: #d97857;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.sidebar button {
  width: 100%;
  padding: 10px;
  border: none;
  background-color: #e8ab98;
  cursor: pointer;
  text-align: left;
}

.sidebar button:hover {
  background-color: #de9e8b;
}

.sidebar button.active {
  background-color: #cc715d;
  color: white;
}

.draw-btn {
  margin-top: 20px;
  background-color: #ae3a1f !important;
  color: #f0e0b0 !important;
  text-align: center !important;
}

.map-wrapper {
  width: 60%;
  position: relative;
}

.map-content {
  width: 100%;
  height: 100%;
}

.content-panel {
  width: 20%;
  background-color: #d97857;
  overflow-y: auto;
  padding: 15px;
  color: #fcf5ee;
}

.content-panel h3 {
  border-bottom: 1px solid rgba(255,255,255,0.3);
  padding-bottom: 5px;
  font-size: 16px;
}

.content-panel p {
  font-size: 14px;
  line-height: 1.5;
}

.footer {
  text-align: center;
  font-size: 12px;
  color: #f0e0b0;
  background-color: #c05744;
  padding: 5px;
  flex-shrink: 0;
}
</style>

<style>
/* Global styles for markers that are dynamically added */
.my-div-icon {
  font-size: 15px;
  font-weight: bold;
  color: #d83615;
  white-space: nowrap;
}
</style>
