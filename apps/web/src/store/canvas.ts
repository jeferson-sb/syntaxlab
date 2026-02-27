import { ref } from "vue";
import { defineStore } from "pinia";

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 2.5;

const clampZoom = (value: number) => Math.min(Math.max(value, MIN_ZOOM), MAX_ZOOM);

export const useCanvasStore = defineStore(
  "canvas",
  () => {
    const zoom = ref(1);
    const offset = ref({ x: 0, y: 0 });

    function zoomIn() {
      zoom.value = clampZoom(zoom.value + 0.1);
    }

    function zoomOut() {
      zoom.value = clampZoom(zoom.value - 0.1);
    }

    function pinchZoom(delta: number) {
      zoom.value = clampZoom(zoom.value + delta);
    }

    function zoomAtPoint(focalPoint: { x: number; y: number }, delta: number) {
      const worldX = (focalPoint.x - offset.value.x) / zoom.value;
      const worldY = (focalPoint.y - offset.value.y) / zoom.value;

      const newZoom = clampZoom(zoom.value + delta);

      offset.value = {
        x: focalPoint.x - worldX * newZoom,
        y: focalPoint.y - worldY * newZoom,
      };
      zoom.value = newZoom;
    }

    function changeOffset(position: { x: number; y: number }) {
      offset.value = position;
    }

    return {
      zoom,
      zoomIn,
      zoomOut,
      pinchZoom,
      zoomAtPoint,
      offset,
      changeOffset,
    };
  },
  {
    storage: {
      adapter: "localStorage",
      namespace: "syntaxlab",
    },
  },
);
