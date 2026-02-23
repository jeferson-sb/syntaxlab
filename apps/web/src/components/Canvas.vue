<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia'
import { useCanvasStore } from '@/store/canvas'
import { useBlockStore } from '@/store/block'

const canvasState = useCanvasStore()
const blockState = useBlockStore()

const { pinchZoom, changeOffset } = canvasState
const { zoom, offset } = storeToRefs(canvasState)

const isPanning = ref(false)
const lastMousePos = ref({ x: 0, y: 0 });

const onMouseDown = (e: MouseEvent) => {
  if ((e.target as Element | null)?.closest('.block')) return;

  isPanning.value = true;
  lastMousePos.value.x = e.clientX;
  lastMousePos.value.y = e.clientY;
};

const onMouseMove = (e: MouseEvent) => {
  if (!isPanning.value) return;
  const dx = e.clientX - lastMousePos.value.x;
  const dy = e.clientY - lastMousePos.value.y;
  changeOffset({ x: offset.value.x + dx, y: offset.value.y + dy })
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
    pinchZoom(delta)
  } else if (!isPanning.value) {
    changeOffset({ x: offset.value.x - e.deltaX, y: offset.value.y - e.deltaY })
  }
}

const selectBlock = (id: string | null) => {
  blockState.selected = id
}

const changePosition = (payload: any) => {
  blockState.updateBlock(payload)
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
})
onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
})

</script>

<template>
  <div class="canvas-viewport" @wheel="onWheel" @mousedown="onMouseDown">
    <div class="canvas-stage" :style="{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }">
      <div class="canvas-grid dot-grid" />

      <svg class="canvas-vector-layer">
        <!-- TODO: add <path> connections -->
        <path v-for="conn in blockState.connections" :key="conn" />
      </svg>

      <div class="canvas-interaction-layer">
        <BlockRenderer v-for="block in blockState.blocks" v-bind:key="block.id" :block="block"
          :selected="block.id === blockState.selected" @select-block="selectBlock(block.id)"
          @change-position="changePosition" />
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