import { ref } from "vue";
import { defineStore } from "pinia";

export const useCanvasStore = defineStore(
  "canvas",
  () => {
    const zoom = ref(1);
    const offset = ref({ x: 0, y: 0 });

    function zoomIn() {
      zoom.value = Math.min(zoom.value + 0.1, 2.5);
    }

    function zoomOut() {
      zoom.value = Math.max(zoom.value - 0.1, 0.2);
    }

    function pinchZoom(delta: number) {
      zoom.value = Math.min(Math.max(zoom.value + delta, 0.2), 2.5);
    }

    function changeOffset(position: { x: number; y: number }) {
      offset.value = position;
    }

    return { zoom, zoomIn, zoomOut, pinchZoom, offset, changeOffset };
  },
  {
    storage: {
      adapter: "localStorage",
      namespace: "syntaxlab",
    },
  }
);
