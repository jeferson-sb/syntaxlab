<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue';
import { useDraggable } from '@vueuse/core'
import type { Block } from '@/types/block';

const { block, selected, isLinkSource } = defineProps<{
  block: Block;
  selected: boolean;
  isLinkSource?: boolean;
}>()
const emit = defineEmits<{
  (e: 'selectBlock'): void
  (e: 'previewPosition', payload: { id: string; x: number; y: number }): void
  (e: 'previewEnd', blockId: string): void
  (e: 'changePosition', update: Partial<Block>): void
}>()

const isEditing = ref(false)
const blockRef = useTemplateRef('block')
const { style } = useDraggable(blockRef, {
  initialValue: { x: block.x, y: block.y },
  stopPropagation: true,
  onMove(position) {
    emit('previewPosition', { id: block.id, x: position.x, y: position.y })
  },
  onEnd(position) {
    emit('previewEnd', block.id)
    emit('changePosition', { id: block.id, x: position.x, y: position.y })
  }
})
</script>

<template>
  <div ref="block" @click="$emit('selectBlock')" @dblclick="isEditing = true"
    :class="{ 'is-link-source': isLinkSource, block: true }" :style="style">
    <StickyNote v-if="block.type === 'sticky'" :block="block" :isEditing="isEditing && selected"
      :class="{ selected: selected }" />
    <CodeSnippet v-else-if="block.type === 'code'" :block="block" :isEditing="isEditing && selected"
      :class="{ selected: selected }" />
    <LinkCard v-else-if="block.type === 'bookmark'" :block="block" :class="{ selected: selected }" />
    <TextCard v-else-if="block.type === 'note'" :block="block" :isEditing="isEditing && selected"
      :class="{ selected: selected }" />
    <ImageCard v-else-if="block.type === 'image'" :block="block" :class="{ selected: selected }" />
  </div>
</template>

<style lang="css" scoped>
.block {
  position: absolute;
  z-index: var(--layer-1);
  user-select: none;
  pointer-events: auto;
  cursor: move;
  translate: 0 0;
  transition: opacity 500ms ease-out, translate 500ms ease-out;
  transform-origin: center;
  will-change: left, top;

  & .selected {
    box-shadow: 0 0 0 6px var(--blue-2);
    transition: box-shadow 200ms ease-in-out;
  }

  &.is-link-source>div {
    outline: 2px dashed var(--purple-4);
    outline-offset: 10px;
  }

  @starting-style {
    opacity: 0;
    translate: 0 20px;
  }

  &:focus-visible {
    outline: 2px dashed var(--purple-4);
  }
}
</style>