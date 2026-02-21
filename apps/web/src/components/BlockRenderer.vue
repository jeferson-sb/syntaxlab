<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue';

const { block, selected } = defineProps(['block', 'selected'])
const emit = defineEmits<{
  (e: 'selectBlock'): void
}>()


const blockRef = useTemplateRef('block')

const onMouseDown = () => {
  emit('selectBlock')
}

</script>

<template>
  <div ref="block" @mousedown="onMouseDown" class="block" :style="{ '--x': block.x, '--y': block.y }">
    <StickyNote v-if="block.type === 'sticky'" :block="block" :class="{ selected: selected }" />
    <CodeSnippet v-else-if="block.type === 'code'" :block="block" :class="{ selected: selected }" />
    <LinkCard v-else-if="block.type === 'bookmark'" :block="block" :class="{ selected: selected }" />
    <TextCard v-else-if="block.type === 'note'" :block="block" :class="{ selected: selected }" />
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
  left: calc(var(--x, unset) * 1px);
  top: calc(var(--y, unset) * 1px);
  translate: 0 0;
  transition: opacity 500ms ease-out, translate 500ms ease-out;

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