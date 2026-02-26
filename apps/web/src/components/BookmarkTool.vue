<script setup lang="ts">
import { ref } from 'vue';
import { X, BookmarkPlus } from 'lucide-vue-next'
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'
import { useBlockStore } from '@/store/block';
import { useCanvasStore } from '@/store/canvas';
import { uniqueId } from '@/lib/uniqueId';

const blockState = useBlockStore()
const canvasState = useCanvasStore()
const title = ref('')
const url = ref('')

const addBookmark = () => {
  const centerX =
    (-canvasState.offset.x + window.innerWidth / 2) / canvasState.zoom;
  const centerY =
    (-canvasState.offset.y + window.innerHeight / 2) / canvasState.zoom;

  blockState.appendBlock({
    id: uniqueId(),
    type: 'bookmark',
    x: (centerX - 100) + Math.floor(Math.random() * 100),
    y: (centerY - 100) + Math.floor(Math.random() * 100),
    props: {
      title: title.value,
      href: url.value,
    }
  })
}
</script>

<template>
  <DialogRoot>
    <DialogTrigger as-child>
      <ToolbarButton>
        <template #icon>
          <BookmarkPlus :size="18" />
        </template>
      </ToolbarButton>
    </DialogTrigger>

    <DialogPortal>
      <DialogOverlay class="dialog-overlay" />
      <DialogContent class="dialog-content">
        <DialogTitle class="dialog-title">
          Add bookmark
        </DialogTitle>

        <fieldset class="input-group">
          <label for="name"> Title </label>
          <input id="name" placeholder="facebook/react" v-model="title">
        </fieldset>

        <fieldset class="input-group">
          <label for="username"> URL </label>
          <input id="username" placeholder="https://github.com/facebook/react" v-model="url">
        </fieldset>

        <div class="actions">
          <DialogClose as-child>
            <button type="button" class="save" @click="addBookmark">
              Create
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
  background: var(--gray-7);
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

  background: var(--stone-0);
  border-radius: var(--radius-3);
  box-shadow: var(--shadow-5);
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
  color: var(--stone-12);
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
    color: var(--gray-7);
  }

  & input {
    all: unset;
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-2);
    padding-inline: var(--size-3);
    height: var(--size-8);
    font-size: var(--font-size-1);
    background: var(--stone-1);
    box-shadow: 0 0 0 1px var(--stone-3);
    color: var(--gray-8);

    &:focus {
      box-shadow: 0 0 0 2px var(--blue-5);
    }
  }
}

.actions {
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