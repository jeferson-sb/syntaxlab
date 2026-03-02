<script lang="ts" setup>
import { Sun, Moon } from 'lucide-vue-next';
import { useSettingsStore } from '@/store/settings';

const settingsState = useSettingsStore();
</script>

<template>
  <button type="button" class="theme-switch"
    :aria-label="settingsState.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
    @click="settingsState.toggleTheme">
    <Sun v-if="settingsState.theme === 'light'" :size="18" />
    <Moon v-else :size="18" />
  </button>
</template>

<style lang="css" scoped>
.theme-switch {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: none;
  border-radius: var(--radius-round);
  background: var(--surface-2);
  color: var(--text-1);
  cursor: pointer;
  transition: background 150ms ease, scale 120ms ease;

  &:hover {
    background: var(--surface-3);
  }

  &:active {
    scale: 0.95;
  }

  &:focus-visible {
    outline: 2px dashed var(--blue-5);
    outline-offset: 2px;
  }
}
</style>
