<script lang="ts" setup>
import {
  MousePointer2,
  Type,
  ImageIcon,
  Trash2,
  Plus,
  Minus,
  StickyNote,
  Code,
  Link2,
} from 'lucide-vue-next';
import { onKeyStroke } from '@vueuse/core'
import { ref, useTemplateRef } from 'vue';

import { useCanvasStore } from '@/store/canvas'
import { useBlockStore } from '@/store/block';
import { useConnectionStore } from '@/store/connection';
import { uniqueId } from '@/lib/uniqueId';

const canvasState = useCanvasStore()
const blockState = useBlockStore()
const connectionState = useConnectionStore()

const colors = [{ css: '#fcfcfc', label: 'offwhite' }, { css: '#fef9c3', label: 'yellow' }, { css: '#dcfce7', label: 'green' }, { css: '#dbeafe', label: 'blue' }, { css: '#f3e8ff', label: 'purple' }]
const currentFontSize = ref({ label: 'base', css: '0.75rem' });
const fileInputRef = useTemplateRef('file')

const isTypingInEditableElement = () => {
  const active = document.activeElement as HTMLElement | null;
  if (!active) return false;

  const tag = active.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    active.isContentEditable
  );
};

const removeSelectedBlock = () => {
  const removedBlockId = blockState.removeSelectedBlock();
  if (!removedBlockId) return;

  connectionState.removeConnectionsForBlock(removedBlockId);
};

const removeConnectionsFromSelectedBlock = () => {
  if (!blockState.selected) return;
  connectionState.removeConnectionsForBlock(blockState.selected);
};

const toggleLinkMode = () => connectionState.toggleLinkMode(blockState.selected);

const toggleUnlinkMode = () => connectionState.toggleUnlinkMode(blockState.selected);

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
      color: colors[0]?.css,
      inlineCode: type === 'code' ? `const myfunction = () => {}` : '',
      lang: type === 'code' ? 'javascript' : '',
      href: '',
      imageUrl: '',
    },
  });
};

const addImageBlock = () => fileInputRef.value.fileInputClick()

const changeTextSize = () => {
  const labels = ['base', 'md', 'lg']
  const sizes = ['0.75rem', '1.1rem', '1.5rem'];
  const currentIndex = sizes.indexOf(currentFontSize.value.css || '0.75rem');
  const nextIndex = (currentIndex + 1) % sizes.length;

  blockState.updateBlock({ props: { textSize: sizes[nextIndex] } })
  currentFontSize.value.css = sizes[nextIndex] || '0.75rem'
  currentFontSize.value.label = labels[nextIndex] || 'base'
}

const shouldIgnoreKeypress = () => isTypingInEditableElement() || blockState.selected;

onKeyStroke('Delete', () => {
  if (isTypingInEditableElement()) return;
  if (blockState.selected) removeSelectedBlock()
})
onKeyStroke('Backspace', () => {
  if (isTypingInEditableElement()) return;
  removeConnectionsFromSelectedBlock();
})
onKeyStroke('Escape', () => {
  connectionState.cancelLinkMode()
  blockState.unselect()
})
onKeyStroke(['t', 'T'], () => { if (shouldIgnoreKeypress()) return; addTemplateBlock('note') })
onKeyStroke(['u', 'U'], () => { if (shouldIgnoreKeypress()) return; addImageBlock() })
onKeyStroke(['c', 'C'], () => { if (shouldIgnoreKeypress()) return; addTemplateBlock('code') })
onKeyStroke(['s', 'S'], () => { if (shouldIgnoreKeypress()) return; addTemplateBlock('sticky') })
onKeyStroke(['l', 'L'], (event) => {
  if (isTypingInEditableElement()) return;
  if (event.shiftKey) {
    toggleUnlinkMode();
    return;
  }
  toggleLinkMode();
})
</script>

<template>
  <div class="toolbar-wrapper">
    <div class="toolbar-container">

      <ToolbarButton active @click="blockState.unselect">
        <template #icon>
          <MousePointer2 :size="18" />
        </template>
        <template #label>{{ blockState.selected ? 'Unselect (ESC)' : 'Select' }}</template>
      </ToolbarButton>

      <ToolbarButton :active="connectionState.isLinkModeActive" @click="toggleLinkMode"
        :aria-pressed="connectionState.isLinkModeActive"
        :title="connectionState.isLinkModeActive ? 'Exit link mode (L)' : 'Enter link mode (L)'">
        <template #icon>
          <Link2 :size="18" />
        </template>
        <template #label>Link</template>
      </ToolbarButton>

      <div class="toolbar-divider" role="separator" aria-orientation="vertical"></div>

      <ToolbarButton @click="addTemplateBlock('note')" shortcut="Text — T">
        <template #icon>
          <Type :size="18" />
        </template>
      </ToolbarButton>

      <ToolbarButton @click="addTemplateBlock('sticky')" shortcut="Sticky Note — S">
        <template #icon>
          <StickyNote :size="18" />
        </template>
      </ToolbarButton>

      <ToolbarButton @click="addTemplateBlock('code')" shortcut="Code — C">
        <template #icon>
          <Code :size="18" />
        </template>
      </ToolbarButton>

      <ToolbarButton @click="addImageBlock()" shortcut="Image — U">
        <template #icon>
          <ImageIcon :size="18" />
        </template>
      </ToolbarButton>

      <BookmarkTool />

      <ToolbarImageUpload ref="file" />

      <div class="toolbar-divider" v-if="blockState.selected" role="separator" aria-orientation="vertical"></div>

      <div class="toolbar-group" v-if="blockState.selected">
        <button type="button" class="tool-btn-secondary" @click="changeTextSize">
          <Type :size="16" />
          <span class="badge-text">{{ currentFontSize.label }}</span>
        </button>

        <div class="color-picker">
          <button type="button" v-for="color in colors" :key="color.css" :aria-label="color.label"
            @click="blockState.updateBlock({ props: { color: color.css } })" class="color-swatch"
            :style="{ backgroundColor: color.css }" />
        </div>

        <div class="toolbar-divider" role="separator" aria-orientation="vertical"></div>

        <button class="tool-btn-danger" aria-label="Delete" @click="removeSelectedBlock">
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

    <p v-if="connectionState.statusMessage" class="toolbar-assistive-status" aria-live="polite" role="status">
      {{ connectionState.statusMessage }}
    </p>
  </div>
</template>

<style lang="css" scoped>
.toolbar-wrapper {
  position: absolute;
  top: var(--size-5);
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--layer-4);
}

.toolbar-container {
  --inner-shadow: inset 0px 0px 8px 0px var(--gray-4);

  display: flex;
  align-items: center;
  gap: var(--size-2);
  padding-inline: var(--size-3);
  padding-block: var(--size-2);

  background: light-dark(oklch(0.9816 0.0017 247.84 / 0.8), oklch(0.25 0.015 260 / 0.85));
  backdrop-filter: blur(10px);
  border: var(--border-size-1) solid var(--border-color);
  border-radius: var(--radius-3);
  box-shadow: var(--inner-shadow);
  animation: var(--animation-slide-in-down) forwards;
  animation-duration: 300ms;
}

[data-theme=light] .toolbar-container {
  box-shadow: var(--shadow-1), var(--shadow-2);
}

.toolbar-divider {
  height: var(--size-5);
  width: var(--border-size-1);
  background: var(--border-color);
  margin-inline: var(--size-1);
}

.toolbar-group,
.zoom-controls {
  display: flex;
  align-items: center;
  gap: var(--size-1);
}

.tool-btn-secondary {
  display: flex;
  align-items: center;
  gap: var(--size-1);
  padding: var(--size-2);
  border-radius: var(--radius-2);
  border: none;
  background: var(--surface-1);
  color: var(--text-2);
  cursor: pointer;
  transition: background 300ms;

  &:hover {
    background: var(--surface-2);
  }
}

.tool-btn-danger {
  padding: var(--size-2);
  border-radius: var(--radius-2);
  border: none;
  background: transparent;
  color: var(--red-5);
  cursor: pointer;
  transition: background 300ms;

  &:hover {
    background: light-dark(var(--red-0), oklch(62.945% 0.22479 26.596 / 0.226));
    color: light-dark(var(--red-7), var(--red-0));
  }
}

.badge-text {
  font-size: var(--font-size-00);
  font-weight: var(--font-weight-7);
  text-transform: uppercase;
}

.zoom-label {
  font-size: var(--font-size-0);
  font-weight: var(--font-weight-7);
  color: var(--text-3);
  width: var(--size-9);
  text-align: center;
}

.zoom-control-minus,
.zoom-control-plus {
  padding: var(--size-2);
  border-radius: var(--size-2);
  color: var(--text-3);
  background: var(--surface-1);

  &:hover {
    color: var(--text-1);
  }
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
  border: var(--border-size-1) solid var(--border-color);
  cursor: pointer;

  &:hover {
    border-color: var(--text-2);
  }
}

.toolbar-assistive-status {
  align-self: center;
  padding: var(--size-1) var(--size-2);
  font-size: var(--font-size-0);
  color: var(--text-2);
  border-radius: var(--radius-2);
  background: var(--surface-1);
  box-shadow: var(--block-shadow);
}
</style>