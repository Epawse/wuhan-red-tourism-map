<script setup lang="ts">
import { useRoute, RouterLink } from 'vue-router'
import MapContainer from '@/components/MapContainer.vue'

const route = useRoute()
</script>

<template>
  <div class="chapter-view">
    <div class="header">
        <RouterLink to="/" class="back-link">← Back</RouterLink>
        <h1>Chapter {{ route.params.id }}</h1>
    </div>
    <div class="map-area">
        <MapContainer />
    </div>
  </div>
</template>

<style scoped>
.chapter-view {
    display: flex;
    flex-direction: column;
    height: 100vh;
    font-family: sans-serif;
}
.header {
    padding: 1rem;
    background: #fff;
    border-bottom: 1px solid #ccc;
    display: flex;
    gap: 1rem;
    align-items: center;
}
.back-link {
    text-decoration: none;
    color: #333;
    font-weight: bold;
}
.map-area {
    flex: 1;
    position: relative;
}
</style>