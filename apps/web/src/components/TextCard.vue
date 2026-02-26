<script lang="ts" setup>
import type { NoteBlock } from '@/types/block';

const props = defineProps<{ block: NoteBlock, isEditing: false }>()
const onFocus = (event: FocusEvent) => {
  const target = event.target as HTMLInputElement;
  target?.select()
}
</script>

<template>
  <div class="text-card" :style="{ '--color': block.props.color, '--font-size': block.props.textSize }">
    <textarea v-if="isEditing" autofocus="true" :defaultValue="block.props.content" v-model="block.props.content"
      @focus="onFocus" />
    <p v-else>{{ block.props.content }}</p>
  </div>
</template>

<style lang="css" scoped>
.text-card {
  padding: var(--size-7);
  box-shadow: var(--shadow-2);
  border-radius: var(--radius-4);
  border: var(--gray-2) var(--border-size-1) solid;
  background: var(--color, oklch(99.107% 0.00011 271));
  min-width: 11rem;
  color: var(--gray-7);
  line-height: var(--font-lineheight-4);
  font-weight: var(--font-weight-6);
  font-size: var(--font-size, var(--font-size-0));

  textarea {
    background: transparent;
    padding: 0;
    resize: none;

    &:focus {
      outline: 0;
    }
  }

  p {
    cursor: text;
    white-space: pre-wrap;
    font: inherit;
  }
}
</style>