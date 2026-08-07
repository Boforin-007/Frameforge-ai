import api from "./api.js";
import { API_ENDPOINTS } from "../config/api.js";

export async function login(credentials) {
  const { data } = await api.post(API_ENDPOINTS.auth.login, credentials);
  return data;
}

export async function register(payload) {
  const { data } = await api.post(API_ENDPOINTS.auth.register, payload);
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await api.get(API_ENDPOINTS.auth.me);
  return data;
}
