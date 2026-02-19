<script lang="ts" setup>
import { Lightbulb } from 'lucide-vue-next'
const props = defineProps(['block'])

const isEditing = false
</script>

<template>
  <div class="sticky-note" :style="{ 'background-color': block.props.color }">
    <div class="sticky-note__header">
      <Lightbulb :size="36" class="icon" />

      <input v-if="isEditing" autofocus="true" :defaultValue="block.props.title" class="title-input" />
      <h3 v-else class="title">
        {{ block.props.title || 'Untitled' }}
      </h3>
    </div>

    <textarea v-if="isEditing" autofocus="true" :defaultValue="block.props.content" />
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
  background: white;

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
    background-color: var(--orange-1);
    color: var(--orange-5);
    border-radius: var(--size-2);
    fill: var(--orange-5);
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