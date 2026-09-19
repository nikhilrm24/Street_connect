
import { Navigate } from "react-router-dom";
function getTokenPayload(token) {
    try {
        const payload = token.split(".")[1];
        return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    } catch {
        return null;
    }
}

function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("token");
    const payload = token ? getTokenPayload(token) : null;

    if (!token || !payload || (payload.exp && payload.exp * 1000 <= Date.now())) {
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(payload.role)) {
        return <Navigate to="/home" replace />;
    }

    return children;
}

export default ProtectedRoute;