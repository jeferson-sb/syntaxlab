<script setup lang="ts">
import { computed, ref } from 'vue';
import { X } from 'lucide-vue-next'
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'

const props = withDefaults(
  defineProps<{
    open: boolean
    mode?: 'create' | 'edit'
    initialTitle?: string
    initialUrl?: string
  }>(),
  {
    mode: 'create',
    initialTitle: '',
    initialUrl: '',
  }
)

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', payload: { title: string; url: string }): void
}>()

const title = ref(props.initialTitle)
const url = ref(props.initialUrl)

const handleSave = () => {
  emit('save', { title: title.value, url: url.value })
  emit('update:open', false)
}

const isValid = computed(() => title.value.trim() !== '' && url.value.trim() !== '')
</script>

<template>
  <DialogRoot :open="open" @update:open="emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay class="dialog-overlay" />
      <DialogContent class="dialog-content">
        <DialogTitle class="dialog-title">
          {{ mode === 'edit' ? 'Edit bookmark' : 'Add bookmark' }}
        </DialogTitle>

        <fieldset class="input-group">
          <label for="bookmark-title">Title</label>
          <input id="bookmark-title" placeholder="facebook/react" v-model="title">
        </fieldset>

        <fieldset class="input-group">
          <label for="bookmark-url">URL</label>
          <input id="bookmark-url" placeholder="https://github.com/facebook/react" v-model="url">
        </fieldset>

        <div class="dialog-actions">
          <DialogClose as-child>
            <button type="button" class="save" @click="handleSave" :disabled="!isValid">
              {{ mode === 'edit' ? 'Save' : 'Create' }}
            </button>
          </DialogClose>
        </div>

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
  background: light-dark(var(--gray-7), var(--gray-9));
  opacity: 0;

  &[data-state=open] {
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
  transform: translate(-50%, -50%);
  z-index: var(--layer-important);

  width: min(100%, 480px);
  padding: var(--size-6);

  background: var(--surface-1);
  border-radius: var(--radius-3);
  box-shadow: var(--block-shadow);
  transform-origin: center;

  &[data-state=open] {
    animation: scale-up 200ms var(--ease-out-3) both;
  }
}

@keyframes scale-up {
  from {
    transform: translate(-50%, -50%) scale(0.4);
  }

  to {
    transform: translate(-50%, -50%) scale(1);
  }
}

.dialog-title {
  font-size: var(--font-size-3);
  font-weight: var(--font-weight-6);
  color: var(--text-1);
  margin-block-end: var(--size-4);
}

.input-group {
  display: flex;
  flex-flow: row wrap;
  gap: var(--size-2);
  margin-block-end: var(--size-3);
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
  margin-top: var(--size-6);
}

.save {
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
