import type { JSX } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Aquí obtienes el token, puede ser de localStorage, context o redux
  const token = localStorage.getItem("authToken");

  if (!token) {
    // Si no hay token, redirige a login
    return <Navigate to="/auth/login" replace />;
  }

  // Si hay token, renderiza el componente hijo
  return children;
};

export default ProtectedRoute;