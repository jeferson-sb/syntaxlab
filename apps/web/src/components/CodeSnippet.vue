<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Copy } from 'lucide-vue-next'
import { codeToHtml } from 'shiki/bundle/web'

const props = defineProps(['block'])
const code = ref('')
const isEditing = false

onMounted(async () => {
  code.value = await codeToHtml(props.block.props.inlineCode, { lang: props.block.props.lang, theme: 'tokyo-night', cssVariablePrefix: 'code' })
})
</script>

<template>
  <div class="code-snippet">
    <div class="code-snippet__header">
      <div class="code-snippet__toolbar">
        <div class="menu-bar">
          <div :style="{ '--menu-actions-bg': '#ff5f56' }"></div>
          <div :style="{ '--menu-actions-bg': '#ffbd2e' }"></div>
          <div :style="{ '--menu-actions-bg': '#27c93f' }"></div>
        </div>
        <span class="title">
          {{ block.props.title }}
        </span>
      </div>
      <div class="copy">
        <Copy :size="16" />
      </div>
    </div>
    <div class="code-snippet__body">
      <textarea v-if="isEditing" autofocus="true" :defaultValue="block.props.inlineCode" />
      <div v-html="code" v-else></div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.code-snippet {
  --bg-color: oklch(22.629% 0.0214 280.483);

  width: var(--size-px-15);
  background-color: var(--bg-color);
  border-radius: var(--radius-3);
  box-shadow: var(--shadow-2);
  overflow: clip;
  font-family: var(--font-monospace-code);
}

.code-snippet__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: var(--size-4);
  padding-block: var(--size-3);
  background-color: var(--bg-color);
  border-block-end: var(--gray-8) var(--border-size-1) solid;

  & .copy svg {
    color: var(--gray-5);
    opacity: 0.8;
    cursor: pointer;
  }
}

.code-snippet__toolbar {
  display: flex;
  align-items: center;
  gap: var(--size-2);

  & .title {
    cursor: text;
    font-weight: var(--font-weight-5);
    font-size: var(--font-size-1);
    color: var(--gray-5);
    margin-inline-start: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.menu-bar {
  display: flex;
  gap: var(--size-2);
  flex-shrink: 0;

  & div {
    width: var(--size-3);
    height: var(--size-3);
    border-radius: var(--radius-round);
    background-color: var(--menu-actions-bg);
  }
}

.code-snippet__body {
  padding: var(--size-4);
  overflow-x: auto;
  background-color: var(--bg-color);
  font-size: var(--font-size-1);
  line-height: var(--font-lineheight-3);

  & pre {
    cursor: text;
    color: var(--gray-2);
  }

  & textarea {
    resize: none;
    background: transparent;
    border: none;
    outline: none;
    padding: 0;
    color: var(--gray-1);
  }
}
</style>