<script lang="ts" setup>
import type { BookmarkBlock } from '@/types/block';
import { Link2 } from 'lucide-vue-next'

const props = defineProps<{ block: BookmarkBlock }>()
</script>

<template>
  <div class="bookmark">
    <div class="bookmark-body">

      <div>
        <div class="bookmark-body__meta">
          <Link2 :size="20" />
          link preview
        </div>
        <h3 class="bookmark-body__title">
          {{ block.props.title }}
        </h3>
      </div>

      <a :href="block.props.href" target="_blank" rel="noopener noreferrer">
        Open
      </a>
    </div>
  </div>
</template>

<style lang="css" scoped>
.bookmark {
  display: flex;
  gap: var(--size-4);
  width: var(--size-px-15);
  background: oklch(99.107% 0.00011 271);
  border-radius: var(--radius-3);
  box-shadow: var(--shadow-2);
  border: var(--gray-2) var(--border-size-1) solid;
  padding: var(--size-4);

  & .bookmark-body {
    display: flex;
    flex: 2;
    justify-content: space-between;
    gap: var(--size-2);

    & .bookmark-body__meta {
      display: flex;
      align-items: center;
      gap: var(--size-2);
      color: var(--gray-6);
      font-size: var(--font-size-0);
      font-weight: var(--font-weight-7);
      text-transform: uppercase;
      letter-spacing: var(--font-letterspacing-3);
    }

    & .bookmark-body__title {
      font-weight: var(--font-weight-7);
      font-size: var(--font-size-3);
      color: var(--gray-8);
      line-height: var(--font-lineheight-1);
      margin-block-end: var(--size-1);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    a {
      background-color: var(--blue-1);
      color: var(--blue-5);
      font-weight: var(--font-weight-7);
      padding-inline: var(--size-3);
      padding-block: var(--size-2);
      border-radius: var(--radius-3);
      transition: background-color 250ms ease, scale 120ms ease;
      align-self: flex-end;
      text-decoration: none;

      &:active {
        scale: 0.95;
      }

      &:hover {
        background-color: var(--blue-2);
      }
    }
  }
}
</style>