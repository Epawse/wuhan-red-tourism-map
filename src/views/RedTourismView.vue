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
const isLoading = ref(true) // Loading state

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
    attribution: '&copy; <a href="https://www.amap.com/">AutoNavi</a> | &copy; <a href="https://leafletjs.com/">Leaflet</a>'
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
  isLoading.value = true // Start loading
  
  const p1 = new Promise<void>((resolve) => {
      Papa.parse('/data/route.csv', {
        download: true,
        complete: (results) => {
          const data = results.data as string[][]
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
          resolve()
        }
      })
  })

  const p2 = new Promise<void>((resolve) => {
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
          resolve()
        }
      })
  })

  await Promise.all([p1, p2])
  
  // Minimum loading time for smooth transition
  setTimeout(() => {
    isLoading.value = false
  }, 800)
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
        className: "custom-label-icon",
        iconSize: [0, 0],
        iconAnchor: [0, 0],
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
    <!-- Map Background -->
    <div class="map-background">
      <div ref="mapContainer" class="map-content"></div>
    </div>

    <!-- Loading Overlay -->
    <Transition name="fade">
      <div class="loading-overlay" v-if="isLoading">
        <div class="spinner"></div>
        <div class="loading-text">载入红色地图故事...</div>
      </div>
    </Transition>

    <!-- Floating Header -->
    <header class="floating-header" v-if="!isLoading">
      <div class="title-card">
        <h1>武汉市红色旅游主题线路</h1>
      </div>
      <nav class="nav-pills">
        <button 
          v-for="(route, id) in routes" 
          :key="id"
          :class="{ active: selectedRouteId === id }"
          @click="handleNavClick(id as string)"
        >
          {{ route.name }}
        </button>
      </nav>
    </header>

    <!-- Floating Sidebar (Left) -->
    <aside class="floating-sidebar left" v-if="selectedRouteId && !isLoading">
      <div class="sidebar-card">
        <h3>{{ routes[selectedRouteId]?.name }}</h3>
        <div class="route-list">
          <TransitionGroup name="list">
            <button 
              v-for="name in sidebarButtons" 
              :key="name"
              :class="{ active: selectedPlaceName === name }"
              @click="handleSideClick(name)"
            >
              <span class="marker-dot"></span>
              {{ name }}
            </button>
          </TransitionGroup>
        </div>
        <button class="draw-btn" @click="handleDrawPathClick">
          <span>📍 绘制游览轨迹</span>
        </button>
      </div>
    </aside>

    <!-- Floating Content Panel (Right) -->
    <aside class="floating-sidebar right" v-if="selectedRouteId && !isLoading">
      <Transition name="fade" mode="out-in">
        <div class="content-card" v-if="selectedPlaceName" key="place">
          <h3>{{ selectedPlaceName }}</h3>
          <div class="desc-content">
            <p>{{ currentPlaceDesc }}</p>
          </div>
        </div>
        <div class="content-card" v-else key="route">
          <h3>线路简介</h3>
          <div class="desc-content">
            <p>{{ currentRouteDesc }}</p>
          </div>
        </div>
      </Transition>
    </aside>


    <!-- Footer Credit -->
    <div class="footer-credit">
      2025 Design
    </div>
  </div>
</template>

<style scoped>
.red-tourism-layout {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #e0e0e0;
}

.map-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.map-content {
  width: 100%;
  height: 100%;
}

/* --- Loading Overlay --- */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #b71c1c; /* Deep Red */
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffd700; /* Gold */
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 215, 0, 0.3);
  border-top: 4px solid #ffd700;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.loading-text {
  font-size: 1.2rem;
  letter-spacing: 2px;
  font-weight: bold;
  text-transform: uppercase;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* --- Floating Header --- */
.floating-header {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 90%;
  max-width: 1200px;
  pointer-events: none; /* Let clicks pass through around items */
  transition: all 0.5s ease;
}

.title-card {
  background: var(--color-primary);
  padding: 10px 30px;
  border-radius: 50px;
  box-shadow: var(--shadow-float);
  pointer-events: auto;
}

.title-card h1 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-accent);
  letter-spacing: 2px;
  font-weight: 700;
}

.nav-pills {
  display: flex;
  gap: 10px;
  pointer-events: auto;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 8px;
  border-radius: 16px;
  box-shadow: var(--shadow-card);
}

.nav-pills button {
  background: transparent;
  border: 2px solid transparent;
  color: var(--color-text-secondary);
  padding: 8px 20px;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.nav-pills button:hover {
  background: rgba(183, 28, 28, 0.05);
  color: var(--color-primary);
}

.nav-pills button.active {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 4px 10px rgba(183, 28, 28, 0.3);
}

/* --- Floating Sidebars --- */
.floating-sidebar {
  position: absolute;
  top: 160px; /* Below header */
  bottom: 60px; /* Above footer */
  width: 320px;
  z-index: 1000;
  pointer-events: none;
  display: flex;
  flex-direction: column;
}

.floating-sidebar.left {
  left: 20px;
}

.floating-sidebar.right {
  right: 20px;
}

.sidebar-card, .content-card {
  background: rgba(255, 255, 255, 0.85); /* Slightly more transparent */
  backdrop-filter: blur(20px) saturate(180%); /* Stronger blur + saturation */
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: var(--radius-lg);
  box-shadow: 
    0 8px 32px 0 rgba(31, 38, 135, 0.15),
    inset 0 0 0 1px rgba(255, 255, 255, 0.4); /* Inner border highlight */
  padding: 24px;
  height: 100%;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-card h3, .content-card h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.2rem;
  color: var(--color-primary-dark);
  border-bottom: 2px solid var(--color-accent);
  padding-bottom: 10px;
  display: inline-block;
}

/* Route List */
.route-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 5px;
}

.route-list button {
  background: transparent;
  border: 1px solid transparent;
  text-align: left;
  padding: 12px 15px;
  border-radius: var(--radius-md);
  color: var(--color-text-main);
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;
}

.marker-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ddd;
  transition: background 0.3s;
}

.route-list button:hover {
  background: #f8f8f8;
  transform: translateX(5px);
}

.route-list button.active {
  background: #fff5f5;
  border-color: #ffcdd2;
  color: var(--color-primary);
  font-weight: bold;
}

.route-list button.active .marker-dot {
  background: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(183, 28, 28, 0.2);
}

/* Draw Button */
.draw-btn {
  margin-top: 20px;
  background: linear-gradient(135deg, var(--color-primary) 0%, #d32f2f 100%);
  color: white;
  padding: 15px;
  border-radius: var(--radius-md);
  font-weight: bold;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(211, 47, 47, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;
}

.draw-btn:active {
  transform: scale(0.98);
}

.draw-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(211, 47, 47, 0.5);
}

/* Content Panel */
.desc-content {
  flex: 1;
  overflow-y: auto;
  font-size: 15px;
  line-height: 1.8;
  color: var(--color-text-secondary);
}

/* Footer */
.footer-credit {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  text-align: center;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  z-index: 900;
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* List Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>

<style>
/* Leaflet Customizations */
.custom-label-icon {
  /* Reset default styles */
  background: none !important;
  border: none !important;
  
  /* Force dimensions to wrap content */
  width: auto !important;
  height: auto !important;
}

/* Target the text inside the divIcon directly since we removed the wrapper div */
.custom-label-icon {
  position: absolute;
  /* Position to the right of the marker anchor (0,0) */
  left: 12px !important; 
  top: 0 !important;
  
  /* Center vertically relative to the point */
  transform: translateY(-50%); 
  
  /* Ensure horizontal layout */
  width: auto !important;
  white-space: nowrap;
  text-align: left;
  
  /* Typography */
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  
  /* Heavy text shadow for readability on any background */
  text-shadow: 
    -1px -1px 0 #b71c1c,  
     1px -1px 0 #b71c1c,
    -1px  1px 0 #b71c1c,
     1px  1px 0 #b71c1c,
     0px 1px 3px rgba(0,0,0,0.8);
     
  pointer-events: none;
}
</style>