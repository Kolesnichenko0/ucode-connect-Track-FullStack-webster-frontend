import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, initialLoading } = useAuth();
  const router = useRouter();
  const publicPaths = ['/', '/login', '/register', '/forgot-password', '/auth/reset-password', '/auth/confirm-email'];

  const isPublicPath = publicPaths.some((path) => {
    if (path === router.pathname) return true;
    return router.pathname.startsWith(path + '/');
  });

  useEffect(() => {
    if (!initialLoading) {
      if (!user && !isPublicPath) {
        router.push('/login');
      }
    }
  }, [user, initialLoading, router, isPublicPath]);


  if (isPublicPath || user) {
    return <>{children}</>;
  }

  return null;
};

export default ProtectedRoute;