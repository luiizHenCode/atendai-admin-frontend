import { useAuth } from "@/contexts/auth/use-auth";
import { Navigate } from "react-router";

interface GuestRouteProps {
  children: React.ReactNode;
  fallback?: string;
}

export function GuestRoute({ children, fallback = "/" }: GuestRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}
