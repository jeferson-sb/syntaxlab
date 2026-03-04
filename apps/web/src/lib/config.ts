export const config = {
  backendUrl: import.meta.env.VITE_BACKEND_URL || "",
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
} as const;
