<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { X, Plus, FolderOpen } from 'lucide-vue-next';
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from 'reka-ui';
import type { Project } from '@/types/project';

const props = defineProps<{
  open: boolean;
  projects: Project[];
  currentProjectId: string;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'create', name: string): void;
  (e: 'select', projectId: string): void;
}>();

const activeTab = ref<'switch' | 'create'>('switch');
const newProjectName = ref('');

const isValid = computed(() => newProjectName.value.trim().length > 0);

const handleCreate = () => {
  if (!isValid.value) return;
  emit('create', newProjectName.value.trim());
  emit('update:open', false);
};

const handleSelect = (projectId: string) => {
  emit('select', projectId);
  emit('update:open', false);
};

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      newProjectName.value = '';
      activeTab.value = 'switch';
    }
  }
);
</script>

<template>
  <DialogRoot :open="open" @update:open="emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay class="dialog-overlay" />
      <DialogContent class="dialog-content">
        <DialogTitle class="dialog-title">Projects</DialogTitle>

        <TabsRoot v-model="activeTab" class="tabs-root">
          <TabsList class="tabs-list" aria-label="Project options">
            <TabsTrigger value="switch" class="tabs-trigger">
              <FolderOpen :size="14" />
              Switch Project
            </TabsTrigger>
            <TabsTrigger value="create" class="tabs-trigger">
              <Plus :size="14" />
              New Project
            </TabsTrigger>
          </TabsList>

          <TabsContent value="switch" class="tabs-content">
            <div class="project-list">
              <button v-for="project in projects" :key="project.id" class="project-item"
                :class="{ active: project.id === currentProjectId }" @click="handleSelect(project.id)">
                <FolderOpen :size="16" />
                <span>{{ project.name }}</span>
              </button>
              <p v-if="projects.length === 0" class="empty-state">
                No projects yet. Create your first one!
              </p>
            </div>
          </TabsContent>

          <TabsContent value="create" class="tabs-content">
            <fieldset class="input-group">
              <label for="project-name">Project Name</label>
              <input id="project-name" v-model="newProjectName" placeholder="My awesome project"
                @keydown.enter="handleCreate" />
            </fieldset>

            <div class="dialog-actions">
              <DialogClose as-child>
                <button type="button" class="btn-cancel">Cancel</button>
              </DialogClose>
              <button type="button" class="btn-create" :disabled="!isValid" @click="handleCreate">
                Create Project
              </button>
            </div>
          </TabsContent>
        </TabsRoot>

        <DialogClose class="close" aria-label="Close">
          <X />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--layer-4);
  background: light-dark(var(--gray-7), var(--gray-10));
  opacity: 0;

  &[data-state='open'] {
    animation: fade-in-opaque 500ms var(--ease-3) forwards;
  }
}

@keyframes fade-in-opaque {
  to {
    opacity: 0.7;
  }
}

.dialog-content {
  position: fixed;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  z-index: var(--layer-important);

  width: min(100%, 420px);
  padding: var(--size-6);

  background: var(--surface-1);
  border-radius: var(--radius-3);
  box-shadow: var(--shadow-3);
  transform-origin: center;

  &[data-state='open'] {
    animation: scale-up 200ms var(--ease-out-3) both;
  }
}

@keyframes scale-up {
  from {
    translate: -50% -50%;
    scale: 0.4;
  }

  to {
    translate: -50% -50%;
    scale: 1;
  }
}

.dialog-title {
  font-size: var(--font-size-3);
  font-weight: var(--font-weight-6);
  color: var(--text-1);
  margin-block-end: var(--size-4);
}

.tabs-root {
  display: flex;
  flex-direction: column;
}

.tabs-list {
  display: flex;
  gap: var(--size-1);
  border-bottom: 1px solid var(--border-color);
  margin-block-end: var(--size-4);
}

.tabs-trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--size-2);
  padding: var(--size-2) var(--size-3);
  font-size: var(--font-size-1);
  font-weight: var(--font-weight-5);
  color: var(--text-2);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 150ms, border-color 150ms;

  &:hover {
    color: var(--text-1);
  }

  &[data-state='active'] {
    color: var(--blue-5);
    border-bottom-color: var(--blue-5);
  }
}

.tabs-content {
  min-height: 200px;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: var(--size-1);
  max-height: 280px;
  overflow-y: auto;
}

.project-item {
  display: flex;
  align-items: center;
  gap: var(--size-3);
  padding: var(--size-3);
  border-radius: var(--radius-2);
  background: var(--surface-2);
  border: 1px solid var(--border-color);
  color: var(--text-1);
  font-size: var(--font-size-1);
  cursor: pointer;
  transition: background 150ms, border-color 150ms;

  &:hover {
    background: var(--surface-3);
  }

  &.active {
    border-color: var(--blue-5);
    background: light-dark(var(--blue-1), var(--blue-7));
  }

  & svg {
    color: var(--text-2);
    flex-shrink: 0;
  }
}

.empty-state {
  color: var(--text-2);
  font-size: var(--font-size-1);
  text-align: center;
  padding: var(--size-6);
}

.input-group {
  display: flex;
  flex-flow: row wrap;
  gap: var(--size-2);
  margin-block-end: var(--size-4);
  border: none;
  padding: 0;

  & label {
    flex-basis: 100%;
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-5);
    color: var(--text-2);
  }

  & input {
    all: unset;
    flex: 1;
    border-radius: var(--radius-2);
    padding-inline: var(--size-3);
    height: var(--size-8);
    font-size: var(--font-size-1);
    background: var(--surface-2);
    box-shadow: 0 0 0 1px var(--border-color);
    color: var(--text-1);

    &:focus {
      box-shadow: 0 0 0 2px var(--blue-5);
    }
  }
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--size-2);
  margin-top: var(--size-4);
}

.btn-cancel {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-3);
  padding-inline: var(--size-4);
  height: var(--size-8);
  font-weight: var(--font-weight-5);
  background: transparent;
  color: var(--text-2);
  cursor: pointer;
  transition: background 120ms ease;

  &:hover {
    background: var(--surface-2);
  }

  &:focus-visible {
    outline: 2px solid var(--blue-7);
  }
}

.btn-create {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-3);
  padding-inline: var(--size-4);
  height: var(--size-8);
  font-weight: var(--font-weight-6);
  background: var(--blue-2);
  color: var(--blue-9);
  cursor: pointer;
  transition: background 120ms ease;

  &:hover {
    background: var(--blue-3);
  }

  &:focus-visible {
    outline: 2px solid var(--blue-7);
  }

  &:active {
    transform: scale(0.95);
  }

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.7;
  }
}

.close {
  all: unset;
  position: absolute;
  top: var(--size-2);
  right: var(--size-2);
  display: inline-flex;
  height: var(--size-7);
  width: var(--size-7);
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-round);
  color: var(--blue-9);
  cursor: pointer;

  &:hover {
    background: var(--blue-2);
  }

  &:focus-visible {
    outline: 2px solid var(--blue-7);
  }
}
</style>
