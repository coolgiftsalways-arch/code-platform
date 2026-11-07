import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/auth.js";

export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
    </div>
  );
}

// Sends logged-out students to /login and brings them back afterwards.
export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;

  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return children;
}
