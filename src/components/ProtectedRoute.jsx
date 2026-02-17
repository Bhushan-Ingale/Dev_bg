import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role: allowedRole }) {
  const role = localStorage.getItem("role");

  // Not logged in
  if (!role) {
    return <Navigate to="/" replace />;
  }

  // Logged in but wrong role
  if (role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
