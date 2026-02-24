<script lang="ts" setup>
import {
  MousePointer2,
  Type,
  ImageIcon,
  Trash2,
  Plus,
  Minus,
  StickyNote,
  Code
} from 'lucide-vue-next';
import { onKeyStroke } from '@vueuse/core'
import { useTemplateRef } from 'vue';

import { useCanvasStore } from '@/store/canvas'
import { useBlockStore } from '@/store/block';
import { uniqueId } from '@/lib/uniqueId';

const canvasState = useCanvasStore()
const blockState = useBlockStore()

const colors = ['#fcfcfc', '#fef9c3', '#dcfce7', '#dbeafe', '#f3e8ff']
const fileInputRef = useTemplateRef('file')

const addTemplateBlock = (type: 'code' | 'note' | 'bookmark' | 'sticky') => {
  const centerX =
    (-canvasState.offset.x + window.innerWidth / 2) / canvasState.zoom;
  const centerY =
    (-canvasState.offset.y + window.innerHeight / 2) / canvasState.zoom;

  blockState.appendBlock({
    id: uniqueId(),
    type,
    x: (centerX - 100) + Math.floor(Math.random() * 100),
    y: (centerY - 100) + Math.floor(Math.random() * 100),
    props: {
      content: "Double click to edit content",
      title: type === "code" ? "new_file.js" : "New Idea",
      color: colors[0],
      inlineCode: type === 'code' ? `const myfunction = () => {}` : '',
      lang: type === 'code' ? 'javascript' : '',
      href: '',
      imageUrl: '',
    },
  });
};

const addImageBlock = () => {
  fileInputRef.value?.focus();
  fileInputRef.value?.click();
}

const onImageUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target?.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const imageUrl = event.target?.result as string;
    const centerX = (-canvasState.offset.x + window.innerWidth / 2) / canvasState.zoom;
    const centerY = (-canvasState.offset.y + window.innerHeight / 2) / canvasState.zoom;

    blockState.appendBlock({
      id: uniqueId(),
      type: 'image',
      x: centerX - 150,
      y: centerY - 150,
      props: {
        title: file.name,
        href: imageUrl
      }
    })
  };
  reader.readAsDataURL(file);
};

onKeyStroke('Delete', () => {
  if (blockState.selected) blockState.removeSelectedBlock()
})
onKeyStroke('Escape', () => blockState.unselect())
onKeyStroke(['t', 'T'], () => { if (!blockState.selected) addTemplateBlock('note') })
onKeyStroke(['u', 'U'], () => { if (!blockState.selected) addImageBlock() })
onKeyStroke(['c', 'C'], () => { if (!blockState.selected) addTemplateBlock('code') })
onKeyStroke(['s', 'S'], () => { if (!blockState.selected) addTemplateBlock('sticky') })
</script>

<template>
  <div class="toolbar-wrapper">
    <div class="toolbar-container">

      <ToolbarButton :active="true" @click="blockState.unselect">
        <template #icon>
          <MousePointer2 :size="18" />
        </template>
        <template #label>{{ blockState.selected ? 'Unselect' : 'Select' }}</template>
      </ToolbarButton>

      <div class="toolbar-divider" role="separator" aria-orientation="vertical"></div>

      <ToolbarButton @click="addTemplateBlock('note')">
        <template #icon>
          <Type :size="18" />
        </template>
      </ToolbarButton>

      <ToolbarButton @click="addTemplateBlock('sticky')">
        <template #icon>
          <StickyNote :size="18" />
        </template>
      </ToolbarButton>

      <ToolbarButton @click="addTemplateBlock('code')">
        <template #icon>
          <Code :size="18" />
        </template>
      </ToolbarButton>

      <ToolbarButton @click="addImageBlock()">
        <template #icon>
          <ImageIcon :size="18" />
        </template>
      </ToolbarButton>

      <input type="file" ref="file" accept="image/*" @change="onImageUpload" hidden />

      <div class="toolbar-divider" role="separator" aria-orientation="vertical"></div>

      <div class="toolbar-group">
        <button class="tool-btn-secondary" title="Change Font Size">
          <Type :size="16" />
          <span class="badge-text">base</span>
        </button>

        <div class="color-picker">
          <button v-for="color in colors" :key="color" @click="blockState.updateBlock({ props: { color } })"
            class="color-swatch" :style="{ backgroundColor: color }" />
        </div>

        <div class="toolbar-divider" role="separator" aria-orientation="vertical"></div>

        <button class="tool-btn-danger" title="Remove block" @click="blockState.removeSelectedBlock">
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