export const config = {
  backendUrl: import.meta.env.VITE_BACKEND_URL || "",
  geminiAPIKey: import.meta.env.VITE_GEMINI_API_KEY || "",
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
} as const;
