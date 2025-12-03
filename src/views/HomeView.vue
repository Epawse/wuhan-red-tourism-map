<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { chapters } from '@/data/chapters'
</script>

<template>
  <main class="home">
    <header>
      <h1>Map Cartography Coursework</h1>
      <p>Modernized with Vue 3 + Leaflet</p>
    </header>

    <div class="showcase">
      <RouterLink to="/red-tourism" class="card highlight">
        <div class="icon">🚩</div>
        <div class="info">
            <h2>Wuhan Red Tourism Route</h2>
            <p>Interactive Map Story - Main Project</p>
        </div>
      </RouterLink>
    </div>

    <section class="chapters-section">
      <h2>Course Exercises</h2>
      <div class="grid">
        <RouterLink 
          v-for="chapter in chapters" 
          :key="chapter.id" 
          :to="`/chapter/${chapter.id}`"
          class="card"
        >
          <span class="id">{{ chapter.id }}</span>
          <!-- <span class="name">{{ chapter.title }}</span> -->
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: sans-serif;
}

header {
  text-align: center;
  margin-bottom: 3rem;
}

h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.showcase {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
}

.card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 1.5rem;
  text-decoration: none;
  color: #333;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.highlight {
  background: linear-gradient(135deg, #ae3a1f 0%, #d97857 100%);
  color: white;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 600px;
}

.highlight .icon {
    font-size: 3rem;
}

.highlight h2 {
    margin: 0;
    font-size: 1.5rem;
}
.highlight p {
    margin: 0;
    opacity: 0.9;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
}

.grid .card {
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #2c3e50;
}

.grid .card:hover {
    border-color: #42b883;
    color: #42b883;
}
</style>