<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue';
import { useDraggable } from '@vueuse/core'

const { block, selected } = defineProps(['block', 'selected'])
const emit = defineEmits<{
  (e: 'selectBlock'): void
  (e: 'changePosition', update: any): void
}>()

const isEditing = ref(false)
const blockRef = useTemplateRef('block')
const { style } = useDraggable(blockRef, {
  initialValue: { x: block.x, y: block.y },
  stopPropagation: true,
  onEnd(position) {
    emit('changePosition', { x: position.x, y: position.y })
  }
})
</script>

<template>
  <div ref="block" @click="$emit('selectBlock')" @dblclick="isEditing = true" class="block" :style="style">
    <StickyNote v-if="block.type === 'sticky'" :block="block" :isEditing="isEditing && !!selected"
      :class="{ selected: selected }" />
    <CodeSnippet v-else-if="block.type === 'code'" :block="block" :isEditing="isEditing && !!selected"
      :class="{ selected: selected }" />
    <LinkCard v-else-if="block.type === 'bookmark'" :block="block" :class="{ selected: selected }" />
    <TextCard v-else-if="block.type === 'note'" :block="block" :isEditing="isEditing && !!selected"
      :class="{ selected: selected }" />
    <ImageCard v-else-if="block.type === 'image'" :block="block" :class="{ selected: selected }" />
  </div>
</template>

<style lang="css" scoped>
.block {
  position: fixed;
  z-index: var(--layer-1);
  user-select: none;
  pointer-events: auto;
  cursor: move;
  translate: 0 0;
  transition: opacity 500ms ease-out, translate 500ms ease-out;
  transform-origin: center;

  & .selected {
    box-shadow: 0 0 0 6px var(--blue-2);
    transition: 200ms ease-in-out;
  }

  @starting-style {
    opacity: 0;
    translate: 0 20px;
  }
}
</style>