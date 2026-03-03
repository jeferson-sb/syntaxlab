<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { X, Lock, Globe } from 'lucide-vue-next'
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  RadioGroupItem,
  RadioGroupRoot,
} from 'reka-ui'
import type { Board } from '@/types/canvasBoard';

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'create', payload: Board): void
}>()

const name = ref('')
const visibility = ref<Board['visibility']>('private')

const isValid = computed(() => name.value.trim().length > 0)

const handleCreate = () => {
  if (!isValid.value) return

  emit('create', {
    name: name.value.trim(),
    visibility: visibility.value,
  })
  emit('update:open', false)
}

// Reset form when dialog opens
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    name.value = ''
    visibility.value = 'private'
  }
})
</script>

<template>
  <DialogRoot :open="open" @update:open="emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay class="dialog-overlay" />
      <DialogContent class="dialog-content">
        <DialogTitle class="dialog-title">
          Create new canvas
        </DialogTitle>

        <fieldset class="input-group">
          <label for="board-name">Name</label>
          <input id="board-name" v-model="name" placeholder="My awesome canvas" @keydown.enter="handleCreate">
        </fieldset>

        <fieldset class="input-group">
          <label>Visibility</label>
          <RadioGroupRoot v-model="visibility" class="visibility-group">
            <label class="visibility-option" :data-selected="visibility === 'private'">
              <RadioGroupItem value="private" class="radio-indicator">
                <span class="radio-dot" />
              </RadioGroupItem>
              <Lock :size="16" />
              <div class="visibility-text">
                <span class="visibility-label">Private</span>
                <span class="visibility-desc">Only you can access</span>
              </div>
            </label>
            <label class="visibility-option" :data-selected="visibility === 'public'">
              <RadioGroupItem value="public" class="radio-indicator">
                <span class="radio-dot" />
              </RadioGroupItem>
              <Globe :size="16" />
              <div class="visibility-text">
                <span class="visibility-label">Public</span>
                <span class="visibility-desc">Anyone with the link can view</span>
              </div>
            </label>
          </RadioGroupRoot>
        </fieldset>

        <div class="dialog-actions">
          <DialogClose as-child>
            <button type="button" class="btn-cancel">
              Cancel
            </button>
          </DialogClose>
          <button type="button" class="btn-create" :disabled="!isValid" @click="handleCreate">
            Create
          </button>
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
  background: light-dark(var(--gray-7), var(--gray-10));
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

.visibility-group {
  display: flex;
  flex-direction: column;
  gap: var(--size-2);
  width: 100%;
}

.visibility-option {
  display: flex;
  align-items: center;
  gap: var(--size-3);
  padding: var(--size-3);
  border-radius: var(--radius-2);
  background: var(--surface-2);
  box-shadow: 0 0 0 1px var(--border-color);
  cursor: pointer;
  transition: box-shadow 150ms ease, background 150ms ease;

  &:hover {
    background: var(--surface-3);
  }

  &[data-selected="true"] {
    box-shadow: 0 0 0 2px var(--blue-5);
    background: var(--blue-1);
  }

  & svg {
    color: var(--text-2);
    flex-shrink: 0;
  }
}

.radio-indicator {
  all: unset;
  width: var(--size-4);
  height: var(--size-4);
  border-radius: var(--radius-round);
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &[data-state="checked"] {
    border-color: var(--blue-5);
  }
}

.radio-dot {
  width: var(--size-2);
  height: var(--size-2);
  border-radius: var(--radius-round);
  background: transparent;

  .radio-indicator[data-state="checked"] & {
    background: var(--blue-5);
  }
}

.visibility-text {
  display: flex;
  flex-direction: column;
  gap: var(--size-1);
}

.visibility-label {
  font-size: var(--font-size-1);
  font-weight: var(--font-weight-6);
  color: var(--text-1);
}

.visibility-desc {
  font-size: var(--font-size-0);
  color: var(--text-2);
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--size-2);
  margin-top: var(--size-6);
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
