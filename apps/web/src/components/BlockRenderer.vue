<script lang="ts" setup>
import { ref, useTemplateRef, watch } from 'vue';
import { useDraggable, useKeyModifier } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useCanvasStore } from '@/store/canvas'
import type { AnyBlock } from '@/types/block';

const { block, selected, isLinkSource } = defineProps<{
  block: AnyBlock;
  selected: boolean;
  isLinkSource?: boolean;
}>()
const emit = defineEmits<{
  (e: 'selectBlock'): void
  (e: 'previewPosition', payload: { id: string; x: number; y: number }): void
  (e: 'previewEnd', blockId: string): void
  (e: 'changePosition', update: Partial<AnyBlock>): void
}>()

const canvasStore = useCanvasStore()
const { zoom } = storeToRefs(canvasStore)

const isEditing = ref(false)
const isResizing = ref(false)
const dragStartMouse = ref({ x: 0, y: 0 })
const resizeStartSize = ref({ width: 0, height: 0 })
const resizePreview = ref<{ width: number; height: number } | null>(null)
const shiftHeld = useKeyModifier('Shift')
const blockRef = useTemplateRef('block')

const MIN_IMAGE_SIZE = 80

const { style, position } = useDraggable(blockRef, {
  initialValue: { x: block.x, y: block.y },
  stopPropagation: true,
  onStart(_pos, event) {
    dragStartMouse.value = { x: event.clientX, y: event.clientY }

    if (event.shiftKey && block.type === 'image') {
      isResizing.value = true
      resizeStartSize.value = {
        width: blockRef.value?.offsetWidth ?? block.props.width ?? 300,
        height: blockRef.value?.offsetHeight ?? block.props.height ?? 200,
      }
    }
  },
  onMove(_pos, event) {
    const deltaX = (event.clientX - dragStartMouse.value.x) / zoom.value
    const deltaY = (event.clientY - dragStartMouse.value.y) / zoom.value

    if (isResizing.value) {
      resizePreview.value = {
        width: Math.max(MIN_IMAGE_SIZE, resizeStartSize.value.width + deltaX),
        height: Math.max(MIN_IMAGE_SIZE, resizeStartSize.value.height + deltaY),
      }
      // Keep the block in place during resize
      position.value = { x: block.x, y: block.y }
      return
    }

    const x = block.x + deltaX
    const y = block.y + deltaY

    position.value = { x, y }
    emit('previewPosition', { id: block.id, x, y })
  },
  onEnd(_pos, event) {
    const deltaX = (event.clientX - dragStartMouse.value.x) / zoom.value
    const deltaY = (event.clientY - dragStartMouse.value.y) / zoom.value

    if (isResizing.value) {
      emit('changePosition', {
        id: block.id,
        props: {
          ...block.props,
          width: Math.max(MIN_IMAGE_SIZE, resizeStartSize.value.width + deltaX),
          height: Math.max(MIN_IMAGE_SIZE, resizeStartSize.value.height + deltaY),
        },
      })
      isResizing.value = false
      resizePreview.value = null
      return
    }

    const x = block.x + deltaX
    const y = block.y + deltaY

    emit('previewEnd', block.id)
    emit('changePosition', { id: block.id, x, y })
  }
})

// Sync position when block is updated externally
watch(
  () => [block.x, block.y] as const,
  ([x, y]) => {
    position.value = { x, y }
  },
)
</script>

<template>
  <div ref="block" @click="$emit('selectBlock')" @dblclick="isEditing = true"
    :class="{ 'is-link-source': isLinkSource, block: true, 'is-resizing': isResizing, 'is-resize-ready': shiftHeld && block.type === 'image' }"
    :style="style">
    <StickyNote v-if="block.type === 'sticky'" v-model:title="block.props.title" v-model:content="block.props.content"
      v-model:aiPreview="block.props.aiPreview" :color="block.props.color" :isEditing="isEditing && selected"
      :class="{ selected: selected }" />
    <CodeSnippet v-else-if="block.type === 'code'" v-model:title="block.props.title"
      v-model:inlineCode="block.props.inlineCode" :isEditing="isEditing && selected" :class="{ selected: selected }" />
    <LinkCard v-else-if="block.type === 'bookmark'" v-model:title="block.props.title" v-model:href="block.props.href"
      :class="{ selected: selected }" />
    <TextCard v-else-if="block.type === 'note'" v-model:content="block.props.content"
      v-model:aiPreview="block.props.aiPreview" :color="block.props.color" :textSize="block.props.textSize"
      :isEditing="isEditing && selected" :class="{ selected: selected }" />
    <ImageCard v-else-if="block.type === 'image'" :title="block.props.title" :src="block.props.href"
      :width="resizePreview?.width ?? block.props.width" :height="resizePreview?.height ?? block.props.height"
      :class="{ selected: selected }" />
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
  width: max-content;

  & .selected {
    box-shadow: 0 0 0 6px var(--blue-2);
    transition: box-shadow 200ms ease-in-out;
  }

  &.is-link-source>div {
    outline: 2px dashed var(--purple-4);
    outline-offset: 10px;
  }

  &.is-resize-ready,
  &.is-resizing {
    cursor: nwse-resize;
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