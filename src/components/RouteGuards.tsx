import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/types';

interface RouteGuardProps {
  children: JSX.Element;
}

// Protects routes that require authentication
export function ProtectedRoute({ children }: RouteGuardProps): JSX.Element {
  const user = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();

  if (!user) {
    // Redirect to login but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Prevents authenticated users from accessing auth pages (login/signup)
export function PublicOnlyRoute({ children }: RouteGuardProps): JSX.Element {
  const user = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();

  if (user) {
    // Redirect to the attempted page or default to /dashboard
    const to = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={to} replace />;
  }

  return children;
} 