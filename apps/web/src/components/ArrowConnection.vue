<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { useEventListener } from '@vueuse/core';
import { useCanvasStore } from '@/store/canvas';

import type { Block } from '@/types/block';
import type { Connection } from '@/types/connection';

const BLOCK_CENTER_X = 120;
const BLOCK_CENTER_Y = 80;
const DEFAULT_CURVE_OFFSET = -50;

const props = defineProps<{
  blocks: Block[];
  conn: Connection;
}>();

const emit = defineEmits<{
  updateCurveOffset: [payload: { id: string; offset: number }];
}>();

const canvasStore = useCanvasStore();
const controlPoint = useTemplateRef<SVGCircleElement>('controlPoint');
const isDragging = ref(false);
const dragStartY = ref(0);
const startOffset = ref(DEFAULT_CURVE_OFFSET);
const currentOffset = ref(props.conn.curveOffset ?? DEFAULT_CURVE_OFFSET);

const curveOffset = computed(() =>
  isDragging.value ? currentOffset.value : (props.conn.curveOffset ?? DEFAULT_CURVE_OFFSET)
);

const coords = computed(() => {
  const fromBlock = props.blocks.find(b => b.id === props.conn.fromBlockId);
  const toBlock = props.blocks.find(b => b.id === props.conn.toBlockId);

  if (!fromBlock || !toBlock) {
    return { x1: 0, y1: 0, x2: 0, y2: 0, ctrlY: 0, dotX: 0, dotY: 0 };
  }

  const x1 = fromBlock.x + BLOCK_CENTER_X;
  const y1 = fromBlock.y + BLOCK_CENTER_Y;
  const x2 = toBlock.x + BLOCK_CENTER_X;
  const y2 = toBlock.y + BLOCK_CENTER_Y;

  // Control point Y for the Bézier curve
  const ctrlY = Math.min(y1, y2) + curveOffset.value;

  // Point on curve at t=0.5 (cubic Bézier formula)
  const dotX = (x1 + x2) / 2;
  const dotY = 0.125 * (y1 + y2) + 0.75 * ctrlY;

  return { x1, y1, x2, y2, ctrlY, dotX, dotY };
});

// Pointer capture ensures events stay on element even when cursor leaves
useEventListener(controlPoint, 'pointerdown', (e: PointerEvent) => {
  e.stopPropagation();
  controlPoint.value?.setPointerCapture(e.pointerId);
  isDragging.value = true;
  dragStartY.value = e.clientY;
  startOffset.value = props.conn.curveOffset ?? DEFAULT_CURVE_OFFSET;
  currentOffset.value = startOffset.value;
});

useEventListener(controlPoint, 'pointermove', (e: PointerEvent) => {
  if (!isDragging.value) return;
  const deltaY = (e.clientY - dragStartY.value) / canvasStore.zoom;
  currentOffset.value = startOffset.value + deltaY;
});

useEventListener(controlPoint, 'pointerup', (e: PointerEvent) => {
  if (!isDragging.value) return;
  controlPoint.value?.releasePointerCapture(e.pointerId);
  isDragging.value = false;
  emit('updateCurveOffset', { id: props.conn.id, offset: currentOffset.value });
});
</script>

<template>
  <g class="arrow-group">
    <path
      :d="`M ${coords.x1} ${coords.y1} C ${coords.x1} ${coords.ctrlY}, ${coords.x2} ${coords.ctrlY}, ${coords.x2} ${coords.y2}`"
      stroke-width="4" fill="none" stroke-dasharray="0" stroke="var(--blue-5)" opacity="0.7" />

    <circle ref="controlPoint" class="control-point" :cx="coords.dotX" :cy="coords.dotY" r="6" stroke="var(--gray-1)"
      stroke-width="1" fill="var(--blue-10)" />
  </g>
</template>

<style scoped>
.arrow-group {
  pointer-events: auto;

  &:hover .control-point {
    opacity: 1;
  }
}

.control-point {
  opacity: 0;
  cursor: grabbing;
  touch-action: none;
  transition: opacity 150ms;
}

.control-point:hover {
  r: 8;
}
</style>
