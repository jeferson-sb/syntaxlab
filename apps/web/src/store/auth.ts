import { computed } from "vue";
import { defineStore } from "pinia";

import { useSession, signIn, signOut } from "@/lib/authClient";

export type AuthProvider = "github" | "google";

export const useAuthStore = defineStore("auth", () => {
  const session = useSession();

  const user = computed(() => session.value?.data?.user ?? null);
  const isLoading = computed(() => session.value?.isPending ?? false);
  const isAuthenticated = computed(() => !!user.value);
  const error = computed(() => session.value?.error?.message ?? null);

  const login = async (provider: AuthProvider) => {
    await signIn.social({
      provider,
      callbackURL: window.location.origin,
    });
  };

  const logout = async () => {
    await signOut();
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
  };
});
