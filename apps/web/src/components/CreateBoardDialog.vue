<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { X, Lock, Globe, WandSparkles } from 'lucide-vue-next'
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogDescription,
  RadioGroupItem,
  RadioGroupRoot,
} from 'reka-ui'
import type { Board } from '@/types/canvasBoard';

type BoardInput = Omit<Board, 'projectId'>;

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'create', payload: BoardInput): void
}>()

const name = ref('')
const visibility = ref<Board['visibility']>('private')

const isValid = computed(() => name.value.trim().length > 0)

const create = () => {
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
      <DialogContent class="dialog-content" :aria-describedby="undefined">
        <div class="top-image">
          <div class="wand" aria-hidden="true">
            <WandSparkles :size="36" />
          </div>
        </div>

        <div class="dialog-container">
          <DialogTitle class="dialog-title">
            Create new canvas
          </DialogTitle>

          <DialogDescription class="dialog-description">
            Start your next big idea on a fresh playground
          </DialogDescription>

          <fieldset class="input-group">
            <label for="board-name">Name</label>
            <input id="board-name" v-model="name" placeholder="My awesome canvas" @keydown.enter="create">
          </fieldset>

          <fieldset class="input-group">
            <p>Visibility</p>
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
            <button type="button" class="btn-create" :disabled="!isValid" @click="create">
              Create
            </button>
          </div>
        </div>

        <DialogClose class="close" aria-label="Close">
          <X />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.top-image {
  --hdr-gradient: linear-gradient(120deg in oklab,
      oklch(60% 0.50 228) 0%,
      oklch(80% 0.5 264) 66%);
  --sdr-gradient: linear-gradient(120deg, #007dff 0%, #005eff 66%);

  background: var(--hdr-gradient);
  height: var(--size-px-12);
  position: relative;
  align-content: center;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(var(--blue-4) 1px, transparent 1px);
    background-size: 24px 24px;
    height: 100%;
    width: 100%;
  }

  & .wand {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-inline: auto;
    background-color: oklch(60% 0.50 228 / 0.7);
    border: var(--border-size-1) solid var(--blue-5);
    border-radius: var(--radius-round);
    width: 64px;
    height: 64px;
  }
}

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

.dialog-container {
  padding: var(--size-6);
}

.dialog-content {
  position: fixed;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  z-index: var(--layer-important);
  overflow: clip;

  width: min(100%, 480px);

  background: var(--surface-1);
  border-radius: var(--radius-3);
  box-shadow: var(--shadow-3);
  transform-origin: center;

  &[data-state=open] {
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
  font-size: var(--font-size-fluid-1);
  font-weight: var(--font-weight-6);
  color: var(--text-1);
}

.dialog-description {
  opacity: 0.7;
  margin-block-end: var(--size-4);
}

.input-group {
  display: flex;
  flex-flow: row wrap;
  gap: var(--size-2);
  margin-block-end: var(--size-4);
  border: none;
  padding: 0;

  & p,
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
  flex: 1;

  & .visibility-option {
    display: flex;
    align-items: center;
    gap: var(--size-3);
    padding: var(--size-3);
    border-radius: var(--radius-2);
    background: var(--surface-2);
    box-shadow: 0 0 0 1px var(--border-color);
    cursor: pointer;
    transition: box-shadow 150ms ease, background 150ms ease;
    margin-block-end: var(--size-2);

    &:hover {
      background: var(--surface-3);
    }

    &[data-selected="true"] {
      box-shadow: 0 0 0 2px var(--blue-5);
      background: light-dark(var(--blue-1), var(--blue-9));
    }

    & svg {
      color: var(--text-2);
      flex-shrink: 0;
    }
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

  & .visibility-label {
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-6);
    color: var(--text-1);
  }

  & .visibility-desc {
    font-size: var(--font-size-0);
    color: var(--text-2);
  }
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
  color: var(--blue-2);
  cursor: pointer;

  &:hover {
    background: var(--blue-6);
  }

  &:focus-visible {
    outline: 2px solid var(--blue-7);
  }
}
</style>
