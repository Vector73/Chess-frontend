import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoutes, children }) => {
    const user = useSelector(state => state.users)
    if (allowedRoutes.includes(window.location.pathname) || user.authenticated === 1) {
        return <>{children}</>;
    } else {
        return <Navigate to="/" />;
    }
};

export default ProtectedRoute;
