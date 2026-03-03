<script setup lang="ts">
import { ref } from 'vue';
import { BookmarkPlus } from 'lucide-vue-next'
import { useBlockStore } from '@/store/block';
import { useCanvasStore } from '@/store/canvas';
import { uniqueId } from '@/lib/uniqueId';

const blockState = useBlockStore()
const canvasState = useCanvasStore()
const isOpen = ref(false)

const addBookmark = (payload: { title: string; url: string }) => {
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
      title: payload.title,
      href: payload.url,
    }
  })
}
</script>

<template>
  <ToolbarButton @click="isOpen = true" shortcut="Bookmark">
    <template #icon>
      <BookmarkPlus :size="18" />
    </template>
  </ToolbarButton>

  <BookmarkDialog v-model:open="isOpen" mode="create" @save="addBookmark" />
</template>