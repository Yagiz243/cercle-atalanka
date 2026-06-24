import { Navigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, redirectTo = '/login', requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { isAdminLoggedIn } = useAdmin();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4 text-muted-foreground">
        Chargement de votre session...
      </div>
    );
  }

  if (requireAdmin) {
    if (!isAdminLoggedIn) {
      return <Navigate to="/admin/login" replace />;
    }
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
