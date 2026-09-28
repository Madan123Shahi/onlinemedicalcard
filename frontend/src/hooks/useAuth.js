import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react"; // 👈 Added for safe TanStack v5 synchronization
import { toast } from "sonner";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

// 1. Fetches the logged-in user on app load or after layout navigation.
export const useCurrentUser = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const { data } = await api.get("/auth/me");
      return data.data; // Matches your backend ApiResponse data object shape
    },
    retry: false, // 401 is an expected state, don't spam network calls
    staleTime: 5 * 60 * 1000, // Keeps local cache fresh for 5 minutes
  });

  // 🔄 TanStack v5 Fix: Sync Zustand store with query state inside an effect hook
  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    } else if (query.isError) {
      clearUser();
    }
  }, [query.data, query.isError, setUser, clearUser]);

  return query;
};

// 2. Log in an existing user
export const useLogin = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials) => {
      const { data } = await api.post("/auth/login", credentials);
      return data.data;
    },
    onSuccess: (user) => {
      setUser(user);
      // Invalidate the cache to ensure clean updates across the UI
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success(`Welcome back, ${user.fullName.split(" ")[0]}!`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });
};

// 3. Register a new user
export const useRegister = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post("/auth/register", payload);
      return data.data;
    },
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("Account created — welcome to OnlineMedicalCard!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });
};

// 4. Log a user out
export const useLogout = () => {
  const clearUser = useAuthStore((s) => s.clearUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      clearUser();
      queryClient.clear(); // Flushes the entire memory cache so no private data leaks
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Logout failed");
    },
  });
};
