<script lang="ts" setup>
import { expandIdea } from '@/services/geminiService'
import { watchDebounced } from '@vueuse/core';
import { useSettingsStore } from '@/store/settings';

const props = defineProps<{ color?: string; textSize?: string; isEditing: boolean }>()

const content = defineModel<string>('content')
const aiPreview = defineModel<string>('aiPreview')

const onFocus = (event: FocusEvent) => {
  const target = event.target as HTMLTextAreaElement;
  target?.select()
}

const settingsState = useSettingsStore()

let controller: AbortController | null = null;

const onKeyTab = (event: KeyboardEvent) => {
  if (aiPreview.value) {
    event.preventDefault();
    content.value = (content.value ?? '') + aiPreview.value;
    aiPreview.value = '';
  }
}

watchDebounced(
  () => content.value,
  async (text) => {
    if (!text) return
    if (!settingsState.preferAiFeatures) return
    if (controller) controller.abort();
    controller = new AbortController();

    aiPreview.value = '';

    const stream = expandIdea(text);

    for await (const chunk of stream) {
      if (controller.signal.aborted) break;
      aiPreview.value = (aiPreview.value ?? '') + chunk;
    }
  },
  { debounce: 1000 },
)
</script>

<template>
  <div class="text-card">
    <div class="editor" v-if="isEditing">
      <div class="editor-backdrop" aria-hidden="true">
        <span class="editor-content">{{ content }}</span>
        <span class="editor-ai-text">{{ aiPreview }}</span>
      </div>
      <textarea autofocus v-model="content" @focus="onFocus" @keydown.tab="onKeyTab" />
    </div>
    <p v-else>{{ content }}</p>
  </div>
</template>

<style lang="css" scoped>
.text-card {
  --color: v-bind(color);
  --font-size: v-bind(textSize);

  padding: var(--size-7);
  box-shadow: var(--block-shadow);
  border-radius: var(--radius-4);
  border: var(--border-color) var(--border-size-1) solid;
  background: var(--color, var(--block-bg));
  min-width: 11rem;
  color: var(--text-2);
  line-height: var(--font-lineheight-4);
  font-weight: var(--font-weight-6);
  font-size: var(--font-size, var(--font-size-0));

  p {
    cursor: text;
    white-space: pre-wrap;
    font: inherit;
  }
}

[data-theme=dark] .text-card {
  background: color-mix(in srgb, var(--color) 25%, #000 75%);
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

    &:focus {
      outline: 0;
    }
  }
}
</style>