import React from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';

const ProtectedRoute = ({ isAuthenticated, allowedRoutes, children }) => {
    
  if (allowedRoutes.includes(window.location.pathname) || isAuthenticated) {
    return <>{children}</>;
  } else {
    return <Navigate to="/" />;
  }
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.users.authenticated === 1,
});

export default connect(mapStateToProps)(ProtectedRoute);
