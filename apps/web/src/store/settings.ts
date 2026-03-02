import { ref } from "vue";
import { defineStore } from "pinia";

export const useSettingsStore = defineStore(
  "settings",
  () => {
    const preferRemoteSync = ref(false);
    const preferAiFeatures = ref(false);

    return {
      preferRemoteSync,
      preferAiFeatures,
    };
  },
  {
    storage: {
      adapter: "localStorage",
      namespace: "syntaxlab",
    },
  }
);
