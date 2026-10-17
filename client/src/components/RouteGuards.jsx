import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../context/useAuth";

const Loading = () => <p className="mt-20 text-center text-slate-500">Loading...</p>;

// Only logged-in users
export function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

// Login/Register - hidden once logged in
export function GuestRoute() {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  return user ? <Navigate to="/" replace /> : <Outlet />;
}

//Admins only
export function AdminRoute() {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "admin" ? <Outlet /> : <Navigate to="/" replace />;
}