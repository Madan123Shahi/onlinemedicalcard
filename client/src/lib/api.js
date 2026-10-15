import axios from "axios";

export const TOKEN_KEY = "omc_token";

const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    /* storage unavailable: continue unauthenticated */
  }
  return config;
});

export const errMsg = (err) =>
  err?.response?.data?.message || "Something went wrong. Check your connection and try again.";

export const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

export const todayISO = () =>
  new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

export default api;
