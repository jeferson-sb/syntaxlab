<script lang="ts" setup>
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { FileDown, Edit3, Menu } from 'lucide-vue-next';
import { ref, computed, watch } from 'vue';
import { toJpeg } from 'html-to-image';
import { useIntervalFn } from '@vueuse/core'
import { treaty } from '@elysiajs/eden'
import type { App } from 'syntaxlab-backend'

import { config } from "@/lib/config";
import { slugify } from '@/lib/slugify';
import { useSettingsStore } from '@/store/settings';
import { useBoardStore } from '@/store/board';
import { useProjectStore } from '@/store/project';
import { useBlockStore } from '@/store/block';

type UpsertResultItem = { clientRef: string; serverId: string; action: string }

const { api } = treaty<App>(config.backendUrl)

const props = defineProps<{
  getCanvasElement: () => HTMLDivElement | null;
}>()

const settingsState = useSettingsStore()
const boardStore = useBoardStore()
const projectStore = useProjectStore()
const blockStore = useBlockStore()

const isSidebarOpen = ref();
const boardName = computed(() => boardStore.currentBoard?.name ?? 'Untitled Canvas');
const lastSyncTime = ref<Date | null>(null);

const exportCommand = () => {
  const target = props.getCanvasElement()

  if (!target) return;

  const download = (dataUrl: string, fileName = 'my-canvas.jpeg') => {
    const link = document.createElement('a')
    link.download = fileName
    link.href = dataUrl
    link.click()
  }

  toJpeg(target, { quality: settingsState.imageQuality, cacheBust: true })
    .then((dataUrl) => download(dataUrl, slugify(boardName.value)))
    .catch(console.error)
}

const TWO_MINUTES = 2 * 60 * 1000
const { pause, resume, isActive } = useIntervalFn(async () => {
  console.log('Remote sync is ON, syncing...')

  const syncStartTime = new Date()

  // Sync projects first
  const projectPayload = projectStore.projects.map(proj => ({
    clientRef: proj.id,
    userId: proj.userId,
    name: proj.name,
    updatedAt: proj.updatedAt.toISOString(),
  }))

  const projectResult = await api.projects.batch.post(projectPayload).catch((err: unknown) => {
    console.error('Project sync failed:', err)
    return null
  })

  projectResult?.data?.results?.forEach((result: UpsertResultItem) => {
    const project = projectStore.projects.find(p => p.id === result.clientRef)
    if (project) project._syncId = result.serverId
  })

  // Sync boards (using project clientRef for linking)
  const boardPayload = boardStore.boards.map(board => ({
    clientRef: board.id,
    name: board.name,
    visibility: board.visibility,
    projectId: board.projectId, // clientRef of the project
    updatedAt: (board.updatedAt ?? new Date()).toISOString(),
  }))

  const boardResult = await api.boards.batch.post(boardPayload).catch((err: unknown) => {
    console.error('Board sync failed:', err)
    return null
  })

  boardResult?.data?.results?.forEach((result: UpsertResultItem) => {
    const board = boardStore.boards.find(b => b.id === result.clientRef)
    if (board) board._syncId = result.serverId
  })

  // Sync only blocks that changed since last sync
  const changedBlocks = lastSyncTime.value
    ? blockStore.blocks.filter(block => {
      const blockUpdatedAt = block.updatedAt ?? new Date(0)
      return blockUpdatedAt > lastSyncTime.value!
    })
    : blockStore.blocks

  if (changedBlocks.length > 0) {
    const blockPayload = changedBlocks.map(block => ({
      clientRef: block.id,
      type: block.type,
      x: block.x,
      y: block.y,
      boardId: block.boardId, // clientRef of the board
      props: block.props ?? {},
      updatedAt: (block.updatedAt ?? new Date()).toISOString(),
    }))

    const blockResult = await api.blocks.batch.post(blockPayload).catch((err: unknown) => {
      console.error('Block sync failed:', err)
      return null
    })

    blockResult?.data?.results?.forEach((result: UpsertResultItem) => {
      const block = blockStore.blocks.find(b => b.id === result.clientRef)
      if (block) block._syncId = result.serverId
    })

    console.log(`Synced ${changedBlocks.length} changed blocks`)
  } else {
    console.log('No blocks changed since last sync')
  }

  lastSyncTime.value = syncStartTime
  console.log('Sync completed')
}, TWO_MINUTES, { immediate: settingsState.preferRemoteSync })

watch(() => settingsState.preferRemoteSync, (enabled) => {
  if (!enabled) {
    pause()
  } else {
    resume()
  }
})
</script>

<template>
  <header class="app-header">
    <div class="app-header__left">
      <button v-if="isSidebarOpen" class="header__toggle">
        <Menu :size="20" />
      </button>

      <div class="header__title">
        <Edit3 class="text-primary" :size="18" role="presentation" aria-label="Pencil" />
        <h2 class="title">{{ boardName }}</h2>
        <span v-if="isActive" aria-live="polite">Syncing every two minutes...</span>
      </div>
    </div>

    <div class="header__actions">
      <div class="switch">
        <label>
          AI suggestions
        </label>

        <SwitchRoot id="server-sync" v-model="settingsState.preferAiFeatures" aria-label="Enable AI Features"
          class="switch__root">
          <SwitchThumb class="switch__thumb" />
        </SwitchRoot>
      </div>

      <div class="switch">
        <label>
          Server Sync
        </label>

        <SwitchRoot id="server-sync" v-model="settingsState.preferRemoteSync" aria-label="Enable server sync"
          class="switch__root">
          <SwitchThumb class="switch__thumb" />
        </SwitchRoot>
      </div>

      <button type="button" class="button__action" @click="exportCommand">
        <FileDown :size="14" />
        Screenshot Canvas
      </button>

      <ThemeSwitch />
    </div>
  </header>
</template>

<style lang="css" scoped>
.app-header {
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: var(--size-5);
  border-block-end: var(--border-size-1) solid var(--border-color);
  background: var(--surface-2);
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
  color: var(--text-1);
  transition: background 150ms ease;

  &:hover {
    background: var(--surface-3);
  }
}

.header__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  & svg {
    color: var(--blue-5);
  }

  & span {
    color: var(--text-3);
    font-style: italic;
    font-size: var(--font-size-0);
  }
}

.title {
  font-size: var(--font-size-1);
  line-height: var(--font-lineheight-2);
  font-weight: var(--font-weight-7);
  color: var(--text-1);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: var(--size-4);
}

.switch {
  display: flex;
  gap: var(--size-1);
  align-items: center;

  & label {
    color: var(--text-1);
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
    border: var(--border-size-1) solid var(--border-color);
    padding: 0;

    &[data-state=unchecked] {
      background-color: var(--surface-3);
    }

    &[data-state=checked] {
      background-color: var(--blue-5);
      border-color: var(--blue-5);
    }

    &:focus-within {
      outline: none;
      border-color: var(--border-color);
    }

    &:focus-visible {
      outline: 2px dashed var(--purple-4);
    }
  }

  & .switch__thumb {
    display: flex;
    align-items: center;
    justify-content: center;
    width: .875rem;
    height: .875rem;
    background: var(--surface-1);
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
  --shadow-color: light-dark(var(--blue-3), var(--blue-8));
  --highlight-color: light-dark(var(--blue-5), var(--blue-6));

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
    0 6px 15px -3px var(--shadow-color),
    0 4px 6px -4px var(--shadow-color);
  transition: transform 120ms ease, background 120ms ease;

  &:active {
    transform: scale(0.95);
  }

  &:hover {
    background: color-mix(in srgb, var(--highlight-color) 90%, black 0%);
  }

  &:focus-visible {
    outline: 2px dashed var(--purple-4);
  }

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.8;
  }
}
</style>