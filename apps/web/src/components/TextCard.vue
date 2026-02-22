<script lang="ts" setup>
const props = defineProps(['block', 'isEditing'])
</script>

<template>
  <div class="text-card" :style="{ '--color': block.props.color }">
    <textarea v-if="isEditing" autofocus="true" :defaultValue="block.props.content" />
    <p v-else>{{ block.props.content }}</p>
  </div>
</template>

<style lang="css" scoped>
.text-card {
  padding: var(--size-7);
  width: var(--size-13);
  box-shadow: var(--shadow-2);
  border-radius: var(--radius-4);
  border: var(--gray-2) var(--border-size-1) solid;
  background: var(--color, white);
  color: var(--gray-7);
  line-height: var(--font-lineheight-4);
  font-weight: var(--font-weight-6);
  font-size: var(--font-size-0);

  textarea {
    background: transparent;
    border: none;
    padding: 0;
    resize: none;
  }

  p {
    cursor: text;
    white-space: pre-wrap;
    font: inherit;
  }
}
</style>