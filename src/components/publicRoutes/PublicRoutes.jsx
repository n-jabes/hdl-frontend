import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoutes = ({ children }) => {
  //   const { isAuthenticated, role } = useAuth();
  const isAuthenticated = true;
  if (isAuthenticated) {
    return (
    //   <Navigate to={role === 'HR' ? '/hr/statistics' : '/restaurant/home'} />
      <Navigate to='/' />
    );
  }

  return children;
};

export default PublicRoutes;
