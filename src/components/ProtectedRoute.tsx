import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const location = useLocation();
  
  // Check if user is authenticated and token is not expired
  const isAuth = authService.isAuthenticated();
  console.log('ProtectedRoute - isAuthenticated:', isAuth, 'Pathname:', location.pathname);
  
  // If not authenticated or token expired, redirect to login
  if (!isAuth) {
    console.log('Not authenticated or token expired, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('Authenticated, rendering protected content');

  // Check role-based access if roles are specified
  if (allowedRoles && allowedRoles.length > 0) {
    const user = authService.getStoredUser();
    if (!user || !allowedRoles.includes(user.role)) {
      // Redirect to dashboard if user doesn't have required role
      console.log('User does not have required role, redirecting to dashboard');
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
