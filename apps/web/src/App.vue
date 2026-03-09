<script setup lang="ts">
import { useTemplateRef } from 'vue'

type CanvasExposed = {
  getCanvasElement: () => HTMLDivElement | null
}

const canvasRef = useTemplateRef<CanvasExposed>('canvasRef')

const getCanvasElement = () => canvasRef.value?.getCanvasElement() ?? null
</script>

<template>
  <div class="app">
    <Sidebar />

    <div class="shell">
      <Header :get-canvas-element="getCanvasElement" />

      <main>
        <Canvas ref="canvasRef" />
        <Toolbar />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  min-height: 100dvh;
  background: var(--canvas-bg);
  color: var(--text-1);
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
