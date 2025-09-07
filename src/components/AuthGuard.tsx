import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useRef } from 'react';

export const AuthGuard = () => {
  const { isLoggedIn, loading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (!loading && !isLoggedIn && !notifiedRef.current) {
      notifiedRef.current = true;
      toast({ title: 'Please sign in to write articles', description: 'You need to log in to access this page.' });
    }
  }, [loading, isLoggedIn]);

  if (loading) return null;
  if (!isLoggedIn) {
    // Redirect to login (or CMS /admin) preserving intended path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

export default AuthGuard;


