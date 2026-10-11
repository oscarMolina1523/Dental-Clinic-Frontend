import type { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useRolePermissions } from "../hooks/useRolePermitions";

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const token = localStorage.getItem("authToken");
    const location = useLocation();
    const { permissions, role } = useRolePermissions();

    if (!token) {
        return <Navigate to="/auth/login" replace />;
    }

    if (!role) {
        return <Navigate to="/auth/login" replace />;
    }

    const currentPath = location.pathname.replace(/\/+$/, "") || "/";

    // Validar que el usuario tenga permiso para la ruta actual.
    if (currentPath !== "/" && !permissions.includes(currentPath)) {
        return <Navigate to="/patients" replace />;
    }

    return children;
};

export default ProtectedRoute;