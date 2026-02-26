<script lang="ts" setup>
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'

defineProps<{ active?: boolean; shortcut?: string }>()
</script>

<template>
  <TooltipProvider :delay-duration="200">
    <TooltipRoot>
      <TooltipTrigger :as-child="true">
        <button type="button" :class="{ 'toolbar-button': true, active }">
          <div class="toolbar-icon">
            <slot name="icon" />
          </div>
          <span class="toolbar-label">
            <slot name="label" />
          </span>
        </button>
      </TooltipTrigger>

      <TooltipPortal v-if="shortcut">
        <TooltipContent class="tooltip-content" :side-offset="5">
          {{ shortcut }}
          <TooltipArrow :width="12" :height="6" />
        </TooltipContent>
      </TooltipPortal>

    </TooltipRoot>
  </TooltipProvider>
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
  flex-shrink: 0;
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

.tooltip-content {
  background-color: var(--gray-9);
  user-select: none;
  padding: var(--size-1) var(--size-2);
  border-radius: var(--radius-2);
}
</style>