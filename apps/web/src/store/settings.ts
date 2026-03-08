import { ref, watch } from "vue";
import { defineStore } from "pinia";

export type Theme = "light" | "dark";

export const useSettingsStore = defineStore(
  "settings",
  () => {
    const preferRemoteSync = ref(false);
    const preferAiFeatures = ref(false);
    const imageQuality = ref(1);
    const theme = ref<Theme>("light");

    const toggleTheme = () => {
      theme.value = theme.value === "light" ? "dark" : "light";
    };

    watch(
      theme,
      (newTheme) => {
        document.body.setAttribute("data-theme", newTheme);
      },
      { immediate: true }
    );

    return {
      preferRemoteSync,
      preferAiFeatures,
      imageQuality,
      theme,
      toggleTheme,
    };
  },
  {
    storage: {
      adapter: "localStorage",
      namespace: "syntaxlab",
    },
  }
);
