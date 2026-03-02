<script lang="ts" setup>
import type { NoteBlock } from '@/types/block';
import { expandIdea } from '@/services/geminiService'
import { watchDebounced } from '@vueuse/core';
import { useSettingsStore } from '@/store/settings';

const props = defineProps<{ block: NoteBlock; isEditing: boolean }>()
const onFocus = (event: FocusEvent) => {
  const target = event.target as HTMLTextAreaElement;
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
  <div class="text-card" :style="{ '--color': block.props.color, '--font-size': block.props.textSize }">
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
.text-card {
  padding: var(--size-7);
  box-shadow: var(--shadow-2);
  border-radius: var(--radius-4);
  border: var(--gray-2) var(--border-size-1) solid;
  background: var(--color, oklch(99.107% 0.00011 271));
  min-width: 11rem;
  color: var(--gray-7);
  line-height: var(--font-lineheight-4);
  font-weight: var(--font-weight-6);
  font-size: var(--font-size, var(--font-size-0));

  p {
    cursor: text;
    white-space: pre-wrap;
    font: inherit;
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
      color: var(--gray-5);
    }
  }

  textarea {
    background: transparent;
    padding: 0;
    resize: none;
    display: block;
    min-inline-size: unset;
    color: inherit;
    caret-color: var(--gray-7);

    &:focus {
      outline: 0;
    }
  }
}
</style>