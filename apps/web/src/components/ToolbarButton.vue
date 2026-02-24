<script lang="ts" setup>
defineProps<{ active?: boolean }>()
</script>

<template>
  <button type="button" :class="{ 'toolbar-button': true, active }">
    <div class="toolbar-icon">
      <slot name="icon" />
    </div>
    <span class="toolbar-label">
      <slot name="label" />
    </span>
  </button>
</template>

<style lang="css" scoped>
.toolbar-icon {
  color: var(--gray-6);
}

.toolbar-label {
  font-size: var(--font-size-1);
  font-weight: var(--font-weight-7);
  color: var(--gray-6);
}

.toolbar-button {
  display: flex;
  align-items: center;
  gap: var(--size-3);
  padding-inline: var(--size-2);
  padding-block: var(--size-1);
  border-radius: var(--size-2);
  background: none;

  &.active {
    background: color-mix(in srgb, var(--blue-5) 10%, #fff 90%);

    & .toolbar-icon,
    .toolbar-label {
      color: var(--blue-5);
    }
  }
}
</style>