<script setup lang="ts">
import { treaty, edenFetch } from '@elysiajs/eden'
import type { App } from 'syntaxlab-backend'

const api = treaty<App>('http://localhost:3000')
const fetch = edenFetch<App>('http://localhost:3000')

</script>

<template>
  <div class="app">
    <Sidebar />

    <div class="shell">
      <Header />

      <main>
        <Canvas />
        <Toolbar />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: var(--gray-2);
  color: var(--gray-9);
  transition: background 200ms ease, color 200ms ease;
  overflow: hidden;
}

.shell {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

main {
  flex: 1;
  position: relative;
  overflow: hidden;
}
</style>
