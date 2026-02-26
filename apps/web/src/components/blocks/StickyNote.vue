<script lang="ts" setup>
import type { StickyBlock } from '@/types/block';
import { Lightbulb } from 'lucide-vue-next'

const props = defineProps<{ block: StickyBlock; isEditing: boolean }>()
const onFocus = (event: FocusEvent) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  target?.select()
}
</script>

<template>
  <div class="sticky-note" :style="{ '--sticky-color': block.props.color }">
    <div class="sticky-note__header">
      <Lightbulb :size="36" class="icon" />

      <input v-if="isEditing" autofocus v-model="block.props.title" @focus="onFocus" class="title-input" />
      <h3 v-else class="title">
        {{ block.props.title || 'Untitled' }}
      </h3>
    </div>

    <textarea v-if="isEditing" autofocus v-model="block.props.content" @focus="onFocus" />
    <p v-else>{{ block.props.content }}</p>

  </div>
</template>

<style lang="css" scoped>
.sticky-note {
  position: relative;
  padding: 1.5rem;
  width: 20rem;
  box-shadow: var(--shadow-2);
  border-radius: var(--radius-3);
  background: var(--sticky-color, oklch(99.107% 0.00011 271));

  & textarea {
    background: transparent;
    border: none;
    padding: 0;
    resize: none;
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-5);
    color: var(--gray-6);
    line-height: var(--font-lineheight-4);
  }

  & textarea:focus,
  & input:focus {
    outline: 0;
  }

  & p {
    color: var(--gray-6);
    font-size: var(--font-size-1);
    line-height: var(--font-lineheight-4);
    font-weight: var(--font-weight-5);
    cursor: text;
    white-space: pre-wrap;
  }
}

.sticky-note__header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-block-end: 0.5rem;

  & .icon {
    --sticky-highlight-bg: var(--sticky-color, var(--orange-1));
    --sticky-highlight-fg: var(--sticky-color, var(--orange-5));

    background-color: color-mix(in srgb, var(--sticky-highlight-bg) 50%, white 50%);
    color: color-mix(in srgb, var(--sticky-highlight-fg) 80%, black 20%);
    border-radius: var(--size-2);
    fill: color-mix(in srgb, var(--sticky-highlight-fg) 80%, black 20%);
    padding: var(--size-2);
  }

  & .title {
    font-size: var(--font-size-2);
    font-weight: var(--font-weight-7);
    color: var(--gray-8);
    cursor: text;
  }

  & .title-input {
    background: transparent;
    font-size: var(--font-size-2);
    font-weight: var(--font-weight-7);
    color: var(--gray-8);
    border: 0;
    padding: 0;
  }
}
</style>