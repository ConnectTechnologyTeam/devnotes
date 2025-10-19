import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";

export const AuthGuard = () => {
  const { isLoggedIn, loading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (!loading && !isLoggedIn && !notifiedRef.current) {
      notifiedRef.current = true;
      toast({
        title: "Authentication Required",
        description: "You need to log in to access this page.",
        variant: "destructive",
      });
    }
  }, [loading, isLoggedIn, toast]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected route
  return <Outlet />;
};

export default AuthGuard;
