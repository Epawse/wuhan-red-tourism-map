import { defineStore } from 'pinia'
import { shallowRef } from 'vue'
import type L from 'leaflet'

export const useMapStore = defineStore('map', () => {
  // Use shallowRef to avoid deep reactivity performance cost on Leaflet internals
  const map = shallowRef<L.Map | null>(null)

  function setMap(instance: L.Map) {
    map.value = instance
  }

  return {
    map,
    setMap
  }
})
