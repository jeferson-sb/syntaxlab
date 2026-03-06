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
    <img :src="block.props.href" :alt="block.props.title" loading="lazy" :width="block.props.width"
      :height="block.props.height">
  </div>
</template>

<style lang="css" scoped>
.image-card {
  --image-max-size: 40rem;

  position: relative;
  box-shadow: var(--block-shadow);
  overflow: hidden;
  border-radius: var(--radius-3);
  max-width: var(--image-max-size);

  & .image-card__metadata {
    position: absolute;
    top: var(--size-3);
    left: var(--size-3);
    z-index: var(--layer-3);

    & span {
      font-size: var(--font-size-0);
      font-weight: var(--font-weight-7);
      letter-spacing: var(--font-letterspacing-3);
      text-transform: uppercase;
      color: white;
      background: oklab(0% 0 0 / 0.4);
      padding-inline: var(--size-2);
      padding-block: var(--size-1);
      border-radius: var(--radius-3);
      opacity: 0;
      transition: opacity 250ms cubic-bezier(0.4, 0, 0.2, 1);
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