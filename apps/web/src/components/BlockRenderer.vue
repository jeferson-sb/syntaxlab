<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue';

defineProps(['block'])

const blockRef = useTemplateRef('block')
const selected = ref(false)
</script>

<template>
  <div ref="block" :class="{ block: true, selected: selected }" :style="{ '--x': block.x, '--y': block.y }">
    <StickyNote v-if="block.type === 'sticky'" :block="block" />
    <CodeSnippet v-else-if="block.type === 'code'" :block="block" />
    <LinkCard v-else-if="block.type === 'bookmark'" :block="block" />
    <TextCard v-else-if="block.type === 'note'" :block="block" />
    <ImageCard v-else-if="block.type === 'image'" :block="block" />
  </div>
</template>

<style lang="css" scoped>
.block {
  position: absolute;
  z-index: var(--layer-1);
  user-select: none;
  pointer-events: auto;
  cursor: move;
  left: var(--x, unset);
  top: var(--y, unset);

  &.selected {
    box-shadow: 0 0 0 4px #fff, 0 0 0 6px var(--blue-3), 0 0 #0000;
  }
}
</style>