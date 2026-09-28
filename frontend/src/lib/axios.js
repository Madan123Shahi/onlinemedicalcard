import axios from "axios";

// A single pre-configured axios instance used everywhere.
// Base URL + cookie behavior is consistently managed here.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api", // Fallback to your local backend port
  withCredentials: true, // 🔒 CRITICAL: Sends and receives httpOnly JWT cookies automatically
});

let isRefreshing = false;
let queue = [];

const processQueue = (error) => {
  queue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()));
  queue = [];
};

// Response Interceptor: Listens for token expirations network-wide
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error isn't an unauthorized 401, or if we already tried retrying this specific request.
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Another concurrent request already triggered a refresh — wait patiently in line
      // instead of firing a second duplicate /refresh API call.
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await api.post("/auth/refresh");

      processQueue(null); // Resolve all pending requests in the queue
      return api(originalRequest); // Re-execute the original failed request
    } catch (refreshError) {
      processQueue(refreshError); // Reject everything in the queue if the session is fully dead

      // 💡 UX Best Practice: If the 7-day refresh token is dead, clear memory and force the user back to Login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
