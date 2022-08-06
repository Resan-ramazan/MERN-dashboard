import React from 'react'
import { Navigate, Outlet } from 'react-router';

export default function ProtectedRoute({ user, redirectPath = '/login', children }) {

  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

