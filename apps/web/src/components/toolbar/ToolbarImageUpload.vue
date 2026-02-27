<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { useCanvasStore } from '@/store/canvas'
import { useBlockStore } from '@/store/block';
import { uniqueId } from '@/lib/uniqueId';

const canvasState = useCanvasStore()
const blockState = useBlockStore()
const fileInputRef = useTemplateRef('file')

const onImageUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target?.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const imageUrl = event.target?.result as string;
    const centerX = (-canvasState.offset.x + window.innerWidth / 2) / canvasState.zoom;
    const centerY = (-canvasState.offset.y + window.innerHeight / 2) / canvasState.zoom;

    blockState.appendBlock({
      id: uniqueId(),
      type: 'image',
      x: centerX - 150,
      y: centerY - 150,
      props: {
        title: file.name,
        href: imageUrl
      }
    })
  };
  reader.readAsDataURL(file);
};

defineExpose({
  fileInputClick() {
    fileInputRef.value?.focus();
    fileInputRef.value?.click();
  }
})
</script>

<template>
  <input ref="file" type="file" accept="image/*" @change="onImageUpload" hidden />
</template>