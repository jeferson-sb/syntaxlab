<script lang="ts" setup>
import { ref, useTemplateRef, onMounted, onUnmounted } from 'vue';

const { zoom, offset, blocks, selected } = defineProps(['zoom', 'offset', 'blocks', 'selected'])
const emit = defineEmits<{
  (e: 'onZoom', amount: number): void
  (e: 'onOffset', offset: { x: number; y: number; }): void
  (e: 'selectBlock', id: string): void
  (e: 'updateBlock', payload: any): void
}>()

const canvas = useTemplateRef('canvas')

const isPanning = ref(false)
const lastMousePos = ref({ x: 0, y: 0 });

const onMouseDown = (e: MouseEvent) => {
  isPanning.value = true;
  lastMousePos.value.x = e.clientX;
  lastMousePos.value.y = e.clientY;
};

const onMouseMove = (e: MouseEvent) => {
  if (!isPanning.value) return;
  const dx = e.clientX - lastMousePos.value.x;
  const dy = e.clientY - lastMousePos.value.y;
  lastMousePos.value.x = e.clientX;
  lastMousePos.value.y = e.clientY;
}

const onMouseUp = () => {
  isPanning.value = false
}

const onWheel = (e: WheelEvent) => {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    emit('onZoom', Math.min(Math.max(zoom + delta, 0.2), 2.5))
  } else if (!isPanning) {
    emit('onOffset', { x: offset.x - e.deltaX, y: offset.y - e.deltaY })
  }
}

onMounted(() => {
  if (isPanning) {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }
})
onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
})

</script>

<template>
  <div ref="canvas" class="canvas-viewport" @wheel.passive="onWheel" @mousedown="onMouseDown">
    <div class="canvas-stage" :style="{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }">
      <div class="canvas-grid dot-grid" />

      <svg class="canvas-vector-layer">
        <!-- TODO: add <path> connections -->
      </svg>

      <div class="canvas-interaction-layer">
        <BlockRenderer v-for="block in blocks" v-bind:key="block.id" :block="block"
          @select-block="$emit('selectBlock', block.id)" :selected="block.id === selected" />
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
  z-index: 0;
  overflow: visible;
}

.canvas-interaction-layer {
  position: absolute;
  inset: 0;
  pointer-events: auto;
}
</style>