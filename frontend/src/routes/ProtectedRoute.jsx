import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCurrentUser } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore"; // 👈 1. Import your Zustand auth store

export default function ProtectedRoute({ role }) {
  // 💡 2. Pull synchronous state from Zustand first
  const { user, isAuthenticated } = useAuthStore();

  // 3. Keep the background network sync running
  const { isLoading } = useCurrentUser();

  // ⏳ 4. Only show loader if Zustand says we aren't logged in YET TanStack is still validating
  if (isLoading && !isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  // 🛡️ 5. Bulletproof gatekeep checks against synchronous Zustand memory
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 🛡️ 6. Role-based clearance evaluation
  if (role && user.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  // 🎉 Safe passage granted
  return <Outlet />;
}
