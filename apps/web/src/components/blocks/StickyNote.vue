<script lang="ts" setup>
import { Lightbulb } from 'lucide-vue-next'
import { watchDebounced } from '@vueuse/core';

import type { StickyBlock } from '@/types/block';
import { expandIdea } from '@/services/geminiService'
import { useSettingsStore } from '@/store/settings';

const props = defineProps<{ block: StickyBlock; isEditing: boolean }>()
const onFocus = (event: FocusEvent) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  target?.select()
}

const settingsState = useSettingsStore()

let controller: AbortController | null = null;

const onKeyTab = (event: KeyboardEvent) => {
  if (props.block.props.aiPreview) {
    event.preventDefault();
    props.block.props.content += props.block.props.aiPreview;
    props.block.props.aiPreview = '';
  }
}

watchDebounced(
  () => props.block.props.content,
  async (text) => {
    if (!text) return
    if (!settingsState.preferAiFeatures) return
    if (controller) controller.abort();
    controller = new AbortController();

    props.block.props.aiPreview = "";

    const stream = expandIdea(text);

    for await (const chunk of stream) {
      if (controller.signal.aborted) break;
      props.block.props.aiPreview += chunk;
    }
  },
  { debounce: 1000 },
)
</script>

<template>
  <div class="sticky-note">
    <div class="sticky-note__header">
      <Lightbulb :size="36" class="icon" />

      <input v-if="isEditing" autofocus v-model="block.props.title" @focus="onFocus" class="title-input" />
      <h3 v-else class="title">
        {{ block.props.title || 'Untitled' }}
      </h3>
    </div>

    <div class="editor" v-if="isEditing">
      <div class="editor-backdrop" aria-hidden="true">
        <span class="editor-content">{{ block.props.content }}</span>
        <span class="editor-ai-text">{{ block.props.aiPreview }}</span>
      </div>
      <textarea autofocus v-model="block.props.content" @focus="onFocus" @keydown.tab="onKeyTab" />
    </div>
    <p v-else>{{ block.props.content }}</p>

  </div>
</template>

<style lang="css" scoped>
.sticky-note {
  --sticky-color: v-bind(block.props.color);

  position: relative;
  padding: var(--size-5);
  width: 20rem;
  box-shadow: var(--block-shadow);
  border-radius: var(--radius-3);
  background: var(--sticky-color, var(--block-bg));

  & textarea:focus,
  & input:focus {
    outline: 0;
  }

  & p {
    color: var(--text-3);
    font-size: var(--font-size-1);
    line-height: var(--font-lineheight-4);
    font-weight: var(--font-weight-5);
    cursor: text;
    white-space: pre-wrap;
  }
}

[data-theme=dark] .sticky-note {
  background: color-mix(in srgb, var(--sticky-color) 25%, #000 75%);
}

.sticky-note__header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-block-end: 0.5rem;

  & .icon {
    --sticky-highlight-bg: var(--sticky-color, var(--orange-1));
    --sticky-highlight-fg: var(--sticky-color, var(--orange-5));

    background-color: color-mix(in srgb, var(--sticky-highlight-bg) 50%, white 50%);
    color: color-mix(in srgb, var(--sticky-highlight-fg) 80%, black 20%);
    border-radius: var(--size-2);
    fill: color-mix(in srgb, var(--sticky-highlight-fg) 80%, black 20%);
    padding: var(--size-2);
  }

  & .title {
    font-size: var(--font-size-2);
    font-weight: var(--font-weight-7);
    color: var(--text-2);
    cursor: text;
  }

  & .title-input {
    background: transparent;
    font-size: var(--font-size-2);
    font-weight: var(--font-weight-7);
    color: var(--text-1);
    border: 0;
    padding: 0;
  }
}

.editor {
  position: relative;
  display: grid;

  .editor-backdrop,
  textarea {
    grid-area: 1 / 1;
    font: inherit;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .editor-backdrop {
    pointer-events: none;
    user-select: none;

    .editor-content {
      visibility: hidden;
    }

    .editor-ai-text {
      color: var(--text-3);
    }
  }

  textarea {
    background: transparent;
    padding: 0;
    resize: none;
    display: block;
    min-inline-size: unset;
    color: inherit;
    caret-color: var(--text-1);
  }
}
</style>