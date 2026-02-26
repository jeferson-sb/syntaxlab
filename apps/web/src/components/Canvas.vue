<script lang="ts" setup>
import { computed, ref, onMounted, onUnmounted, reactive, useTemplateRef } from 'vue';
import { storeToRefs } from 'pinia'
import { useCanvasStore } from '@/store/canvas'
import { useBlockStore } from '@/store/block'
import { useConnectionStore } from '@/store/connection'
import type { Block } from '@/types/block';

const canvas = useTemplateRef('canvas')

defineExpose({
  getCanvasElement: () => canvas.value,
})

const canvasState = useCanvasStore()
const blockState = useBlockStore()
const connectionState = useConnectionStore()

const { pinchZoom, changeOffset } = canvasState
const { zoom, offset } = storeToRefs(canvasState)

const isPanning = ref(false)
const isSpacePressed = ref(false)
const lastMousePos = ref({ x: 0, y: 0 });
const dragPreviewPositions = reactive<Record<string, { x: number; y: number }>>({})

const blocksWithDragPreview = computed(() => {
  return blockState.blocks.map((block) => {
    const preview = dragPreviewPositions[block.id]
    if (!preview) return block

    return {
      ...block,
      x: preview.x,
      y: preview.y,
    }
  })
})

const onMouseDown = (e: MouseEvent) => {
  if (!isSpacePressed.value) return;
  if ((e.target as Element | null)?.closest('.block')) return;

  e.preventDefault();
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

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false

  return (
    target.isContentEditable ||
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT'
  )
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.code !== 'Space') return
  if (isTypingTarget(e.target)) return

  e.preventDefault()
  isSpacePressed.value = true
}

const onKeyUp = (e: KeyboardEvent) => {
  if (e.code !== 'Space') return
  isSpacePressed.value = false
  isPanning.value = false
}

const onWindowBlur = () => {
  isSpacePressed.value = false
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
  if (!id) {
    blockState.selected = null
    return
  }

  const { selectedBlockId } = connectionState.toggleBlockLink(id)
  blockState.selected = selectedBlockId
}

const changePosition = (payload: Partial<Block>) => {
  blockState.updateBlock(payload)
}

const previewPosition = (payload: { id: string; x: number; y: number }) => {
  dragPreviewPositions[payload.id] = { x: payload.x, y: payload.y }
}

const clearPreviewPosition = (blockId: string) => {
  delete dragPreviewPositions[blockId]
}

onMounted(() => {
  // window.addEventListener('keydown', onKeyDown);
  // window.addEventListener('keyup', onKeyUp);
  // window.addEventListener('blur', onWindowBlur);
  // window.addEventListener('mousemove', onMouseMove);
  // window.addEventListener('mouseup', onMouseUp);
})
onUnmounted(() => {
  // window.removeEventListener('keydown', onKeyDown);
  // window.removeEventListener('keyup', onKeyUp);
  // window.removeEventListener('blur', onWindowBlur);
  // window.removeEventListener('mousemove', onMouseMove);
  // window.removeEventListener('mouseup', onMouseUp);
})
</script>

<template>
  <div ref="canvas" class="canvas-viewport" :class="{ 'is-space-panning': isSpacePressed, 'is-panning': isPanning }"
    @wheel="onWheel" @mousedown="onMouseDown">
    <div class="canvas-stage" :style="{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }">
      <div class="canvas-grid dot-grid" />

      <svg class="canvas-vector-layer">
        <ArrowConnection v-for="conn in connectionState.connections" :key="conn.id" :conn="conn"
          :blocks="blocksWithDragPreview" />
      </svg>

      <div class="canvas-interaction-layer">
        <BlockRenderer v-for="block in blockState.blocks" v-bind:key="block.id" :block="block"
          :selected="block.id === blockState.selected" @select-block="selectBlock(block.id)"
          :is-link-source="connectionState.linkSourceBlockId === block.id" @preview-position="previewPosition"
          @preview-end="clearPreviewPosition" @change-position="changePosition" />
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
  cursor: default;

  &.is-space-panning {
    cursor: grab;
  }

  &.is-panning {
    cursor: grabbing;
  }
}

.canvas-stage {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transform-origin: 0px 0px;
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