import React from 'react';
import { Navigate } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoutes, children }) => {
    const user = useSelector(state => state.users)
    console.log(user);
    if (allowedRoutes.includes(window.location.pathname) || user.authenticated === 1) {
        console.log("in")
        return <>{children}</>;
    } else {
        return <Navigate to="/" />;
    }
};

export default ProtectedRoute;
