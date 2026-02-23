<script lang="ts" setup>
import {
  MousePointer2,
  Type,
  PenTool,
  ImageIcon,
  Trash2,
  Plus,
  Minus
} from 'lucide-vue-next';
import type { Block } from '@/types/block';
import { useCanvasStore } from '@/store/canvas'

const canvasState = useCanvasStore()

defineProps(['selected'])

const colors = ['#ffffff', '#fef9c3', '#dcfce7', '#dbeafe', '#f3e8ff']

const emit = defineEmits<{
  (e: 'addBlock', type: Block['type']): void
  (e: 'updateBlock', partial: any): void
  (e: 'removeBlock'): void
  (e: 'unselect'): void
}>()
</script>

<template>
  <div class="toolbar-wrapper">
    <div class="toolbar-container">

      <ToolbarButton active="true" @click="$emit('unselect')">
        <template #icon>
          <MousePointer2 :size="18" />
        </template>
        <template #label>{{ selected ? 'Unselect' : 'Select' }}</template>
      </ToolbarButton>

      <div class="toolbar-divider" role="separator" aria-orientation="vertical"></div>

      <ToolbarButton @click="$emit('addBlock', 'note')">
        <template #icon>
          <Type :size="18" />
        </template>
        <template #label></template>
      </ToolbarButton>

      <ToolbarButton @click="$emit('addBlock', 'sticky')">
        <template #icon>
          <PenTool :size="18" />
        </template>
        <template #label></template>
      </ToolbarButton>

      <ToolbarButton @click="$emit('addBlock', 'image')">
        <template #icon>
          <ImageIcon :size="18" />
        </template>
        <template #label></template>
      </ToolbarButton>

      <div class="toolbar-divider" role="separator" aria-orientation="vertical"></div>

      <div class="toolbar-group">
        <button class="tool-btn-secondary" title="Change Font Size">
          <Type :size="16" />
          <span class="badge-text">base</span>
        </button>

        <div class="color-picker">
          <button v-for="color in colors" :key="color" @click="$emit('updateBlock', { props: { color } })"
            class="color-swatch" :style="{ backgroundColor: color }" />
        </div>

        <div class="toolbar-divider" role="separator" aria-orientation="vertical"></div>

        <button class="tool-btn-danger" title="Remove block" @click="$emit('removeBlock')">
          <Trash2 :size="16" />
        </button>
      </div>

      <div class="toolbar-divider" role="separator" aria-orientation="vertical"></div>

      <div class="zoom-controls">
        <button class="zoom-control-minus" aria-label="Zoom Out" @click="canvasState.zoomOut">
          <Minus :size="16" />
        </button>
        <span class="zoom-label">{{ Math.round(canvasState.zoom * 100) }}%</span>
        <button class="zoom-control-plus" aria-label="Zoom In" @click="canvasState.zoomIn">
          <Plus :size="16" />
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
@import "open-props/style";

.toolbar-wrapper {
  position: absolute;
  top: var(--size-5);
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--layer-4);
}

.toolbar-container {
  display: flex;
  align-items: center;
  gap: var(--size-2);
  padding-inline: var(--size-3);
  padding-block: var(--size-2);

  background: var(--gray-0);
  border: var(--border-size-1) solid var(--gray-1);
  border-radius: var(--radius-3);
  box-shadow: var(--shadow-1), var(--shadow-2);
  animation: var(--animation-slide-in-down) forwards;
  animation-duration: 300ms;
}

.toolbar-divider {
  height: var(--size-5);
  width: var(--border-size-1);
  background: var(--gray-2);
  margin-inline: var(--size-1);
}

.toolbar-group,
.zoom-controls {
  display: flex;
  align-items: center;
  gap: var(--size-1);
}

.tool-btn-secondary,
.tool-btn-icon-only {
  display: flex;
  align-items: center;
  gap: var(--size-1);
  padding: var(--size-2);
  border-radius: var(--radius-2);
  border: none;
  background: var(--gray-0);
  color: var(--gray-7);
  cursor: pointer;
  transition: background 300ms;
}

.tool-btn-secondary:hover,
.tool-btn-icon-only:hover {
  background: var(--slate-1);
}

.tool-btn-danger {
  padding: var(--size-2);
  border-radius: var(--radius-2);
  border: none;
  background: transparent;
  color: var(--red-5);
  cursor: pointer;
  transition: background 300ms;
}

.tool-btn-danger:hover {
  background: var(--red-0);
  color: var(--red-7);
}

.badge-text {
  font-size: var(--font-size-00);
  font-weight: var(--font-weight-7);
  text-transform: uppercase;
}

.zoom-label {
  font-size: var(--font-size-0);
  font-weight: var(--font-weight-7);
  color: var(--gray-6);
  width: var(--size-9);
  text-align: center;
}

.zoom-control-minus,
.zoom-control-plus {
  padding: var(--size-2);
  border-radius: var(--size-2);
  color: var(--gray-6);
  background: var(--gray-0);
}

.color-picker {
  display: flex;
  gap: var(--size-1);
  padding-inline: var(--size-1);
}

.color-swatch {
  width: var(--size-4);
  height: var(--size-4);
  border-radius: var(--radius-round);
  border: var(--border-size-1) solid var(--slate-2);
  cursor: pointer;
}
</style>