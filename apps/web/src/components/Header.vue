<script lang="ts" setup>
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { FileDown, Edit3, Menu } from 'lucide-vue-next';
import { ref } from 'vue';
import { toJpeg } from 'html-to-image';

const props = defineProps<{
  getCanvasElement: () => HTMLDivElement | null;
}>()

const isSidebarOpen = ref();
const boardName = ref('Ideation Canvas');
const serverSync = ref(false)

const exportCommand = () => {
  const target = props.getCanvasElement()

  if (!target) return;

  const download = (dataUrl: string, fileName = 'my-canvas.jpeg') => {
    const link = document.createElement('a')
    link.download = fileName
    link.href = dataUrl
    link.click()
  }

  toJpeg(target, { quality: 0.8, cacheBust: true })
    .then((dataUrl) => download(dataUrl))
    .catch(console.error)
}
</script>

<template>
  <header class="app-header">
    <div class="app-header__left">
      <button v-if="isSidebarOpen" class="header__toggle">
        <Menu :size="20" />
      </button>

      <div class="header__title">
        <Edit3 class="text-primary" :size="18" />
        <h2 class="title">{{ boardName }}</h2>
        <span class="badge-live">LIVE</span>
      </div>
    </div>

    <div class="header__actions">
      <div class="switch">
        <label>
          Server Sync
        </label>

        <SwitchRoot id="server-sync" v-model="serverSync" class="switch__root">
          <SwitchThumb class="switch__thumb" />
        </SwitchRoot>
      </div>

      <button type="button" class="button__action" @click="exportCommand">
        <FileDown :size="14" />
        Screenshot Canvas
      </button>
    </div>
  </header>
</template>

<style lang="css" scoped>
.app-header {
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: 1.5rem;
  border-block-end: 1px solid var(--gray-3);
  background: var(--gray-1);
  backdrop-filter: blur(12px);
  z-index: var(--layer-3);
}

.app-header__left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header__toggle {
  padding: 0.5rem;
  border-radius: var(--radius-3, 0.5rem);
  background: transparent;
  transition: background 150ms ease;
}

.header__toggle:hover {
  background: var(--surface-2, #f1f5f9);
}

.header__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  & svg {
    color: var(--blue-5);
  }
}

.icon-primary {
  color: var(--primary, #7c3aed);
}

.title {
  font-size: var(--font-size-1);
  line-height: var(--font-lineheight-2);
  font-weight: var(--font-weight-7);
  color: var(--gray-7);
}

.badge-live {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.625rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background: rgba(16, 185, 129, 0.12);
  color: rgba(16, 185, 129, 0.95);
  margin-left: 0.5rem;
}

.header__actions {
  display: flex;
  align-items: center;
  gap: var(--size-2);
}

.switch {
  display: flex;
  gap: var(--size-1);
  align-items: center;

  & label {
    color: var(--gray-8);
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-5);
    padding-inline-end: var(--size-2);
    user-select: none;
  }

  & .switch__root {
    display: flex;
    position: relative;
    align-items: center;
    width: 32px;
    height: 20px;
    transition: background 150ms var(--ease-in-3);
    border-radius: var(--radius-round);
    border: var(--border-size-1) solid var(--gray-4);
    padding: 0;

    &[data-state=unchecked] {
      background-color: var(--gray-3);
    }

    &[data-state=checked] {
      background-color: var(--gray-8);
      border-color: var(--gray-4);
    }

    &:focus-within {
      outline: none;
      border-color: var(--gray-4);
    }
  }

  & .switch__thumb {
    display: flex;
    align-items: center;
    justify-content: center;
    width: .875rem;
    height: .875rem;
    background: white;
    font-size: var(--font-size-0);
    border-radius: var(--radius-round);
    transition: translate 150ms var(--ease-out-3);
    translate: 2px 0;
    will-change: translate;

    &[data-state=checked] {
      translate: 100%;
    }
  }
}

.button__action {
  display: inline-flex;
  align-items: center;
  gap: var(--size-2);
  background: var(--blue-5);
  color: white;
  font-weight: var(--font-weight-7);
  font-size: var(--font-size-0);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-3);
  box-shadow: 0 0 #0000,
    0 0 #0000,
    0 6px 15px -3px var(--blue-3),
    0 4px 6px -4px var(--blue-3);
  transition: transform 120ms ease, background 120ms ease;

  &:active {
    transform: scale(0.95);
  }

  &:hover {
    background: color-mix(in srgb, var(--blue-5) 90%, black 0%);
  }

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.8;
  }
}
</style>