<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue';

const canvas = useTemplateRef('canvas')
const nodes = ref([])

// TODO: handle mouse up, mouse down, mouse wheel, panning, etc

</script>

<template>
  <div ref="canvas" class="canvas-viewport">
    <div class="canvas-stage">
      <div class="canvas-grid dot-grid" />

      <svg class="canvas-vector-layer">
        <!-- TODO: add <path> connections -->
      </svg>

      <div class="canvas-interaction-layer">
        <!-- TODO: add node renderer -->
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.canvas-viewport {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}

.canvas-stage {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.canvas-grid {
  position: absolute;
  pointer-events: auto;
  width: 20000px;
  height: 20000px;
  left: -10000px;
  top: -10000px;

  background: var(--gray-2);
  background-image: radial-gradient(var(--gray-5) 1px, transparent 1px);
  background-size: 24px 24px;
}

.canvas-vector-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: var(--layer-1);
  overflow: visible;
}

.canvas-interaction-layer {
  position: absolute;
  inset: 0;
  pointer-events: auto;
}
</style>