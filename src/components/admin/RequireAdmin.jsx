import { Navigate, Outlet } from "react-router-dom";

export default function RequireAdmin() {
  const rawUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  if (!rawUser) {
    return <Navigate to="/login" replace />;
  }

  let user = null;

  try {
    user = JSON.parse(rawUser);
  } catch (e) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin =
    user?.roles?.some((r) => r.name === "admin") || false;

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}