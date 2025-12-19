import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to login page with the return url
        // Since we have multiple login pages, we default to the first role or home
        // A better approach would be a generic login page or redirecting based on intended role if known.
        // For now, let's redirect to home or a generic login choice if possible.
        // Given the structure /login/:role, we need a role.

        // If allowedRoles has only one role, assume that's the one.
        if (allowedRoles && allowedRoles.length === 1) {
            return <Navigate to={`/login/${allowedRoles[0]}`} state={{ from: location }} replace />;
        }

        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // User authorized but not for this role
        // Redirect to their own dashboard
        return <Navigate to={`/dashboard/${user.role}`} replace />;
    }

    return children;
};

export default ProtectedRoute;
