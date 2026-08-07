import env from "./environment.js";

export const API_CONFIG = {
  baseURL: env.apiBaseUrl,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
};

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    me: "/auth/me",
  },
  templates: {
    list: "/templates",
    detail: (id) => `/templates/${id}`,
    create: "/templates",
    update: (id) => `/templates/${id}`,
    delete: (id) => `/templates/${id}`,
  },
  generator: {
    generate: "/generate",
    batch: "/generate/batch",
  },
  upload: {
    image: "/upload/image",
  },
};