import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth.jsx";

export function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <p className="p-10 text-ink-soft">Loading your account…</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  return <Outlet />;
}

export function RequireAdmin() {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-10 text-ink-soft">Loading your account…</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: "/admin" }} />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
