const env = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  appName: import.meta.env.VITE_APP_NAME || "FrameForge AI",
};

export default env;