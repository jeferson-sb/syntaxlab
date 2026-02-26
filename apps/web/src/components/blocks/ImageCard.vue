<script lang="ts" setup>
import type { ImageBlock } from '@/types/block';

const props = defineProps<{ block: ImageBlock }>()
</script>

<template>
  <div class="image-card">
    <div class="image-card__metadata">
      <span>
        {{ block.props.title || 'Image' }}
      </span>
    </div>
    <img :src="block.props.href" :alt="block.props.title" loading="lazy">
  </div>
</template>

<style lang="css" scoped>
.image-card {
  position: relative;
  box-shadow: var(--shadow-3);
  overflow: hidden;
  background: white;
  border-radius: var(--radius-3);
  width: var(--size-14);

  & .image-card__metadata {
    position: absolute;
    top: var(--size-3);
    left: var(--size-3);
    z-index: var(--layer-3);

    & span {
      font-size: 0.75rem;
      font-weight: var(--font-weight-7);
      letter-spacing: var(--font-letterspacing-3);
      text-transform: uppercase;
      color: white;
      background: rgb(0 0 0 / 0.4);
      backdrop-filter: blur(12px);
      padding-inline: var(--size-2);
      padding-block: var(--size-1);
      border-radius: var(--radius-3);
      opacity: 0;
      transition-property: opacity;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 250ms;
    }
  }

  & img {
    user-select: none;
    pointer-events: none;
  }

  &:hover .image-card__metadata span {
    opacity: 1;
  }
}
</style>