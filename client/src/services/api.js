import axios from "axios";
import { API_CONFIG } from "../config/api.js";

const api = axios.create(API_CONFIG);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ff_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ff_token");
      localStorage.removeItem("ff_user");
    }
    return Promise.reject(error);
  }
);

export default api;
