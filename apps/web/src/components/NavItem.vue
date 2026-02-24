<script lang="ts" setup>
defineProps<{ label: string; active?: boolean }>()
</script>

<template>
  <li :class="{ 'nav-item': true, 'active': active }">
    <slot />
    <p class="nav-item__text">{{ label }}</p>
  </li>
</template>

<style lang="css" scoped>
.nav-item {
  display: flex;
  align-items: center;
  gap: var(--size-2);
  padding: var(--size-2) var(--size-3);
  border-radius: var(--radius-2);
  cursor: pointer;
  color: var(--gray-7);

  &.active {
    color: var(--blue-5);
    background-color: color-mix(in srgb, var(--blue-4) 20%, #fff 80%);
  }

  &:hover:not(.active) {
    background-color: var(--gray-2);
  }
}

.nav-item__text {
  font-size: var(--font-size-0);
  font-weight: var(--font-weight-6);
  line-height: var(--font-lineheight-1);
}
</style>