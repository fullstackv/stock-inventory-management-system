import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../api/axios";

// allowedRoles: optional array (e.g. ["storekeeper"] or ["owner"]).
// Every route that uses this component currently passes allowedRoles.
const ProtectedRoute = ({ allowedRoles }) => {
  // "checking" | "authenticated" | "unauthenticated"
  const [authStatus, setAuthStatus] = useState("checking");
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      try {
        // The backend uses server-side sessions (cookie-based) and also
        // re-verifies the account is still active on every request, so a
        // deactivated storekeeper is bounced out right here.
        const res = await api.get("/dashboard");
        if (isMounted) {
          setUser(res.data.user);
          setAuthStatus("authenticated");
        }
      } catch (error) {
        if (isMounted) setAuthStatus("unauthenticated");
        console.debug("Session check failed:", error?.message);
      }
    };

    verifySession();
    return () => { isMounted = false; };
  }, []);

  if (authStatus === "checking") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-surface dark:bg-ink-900">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-700/20 border-t-brand-700" />
        <p className="text-sm text-ink-700/50 dark:text-white/50">Checking session...</p>
      </div>
    );
  }

  if (authStatus !== "authenticated") {
    return <Navigate to="/login" replace />;
  }

  // Logged in, but this page isn't meant for their role (e.g. an owner
  // opening a storekeeper-only inventory page, or vice versa). Send them
  // to the page that actually belongs to them instead of letting every
  // API call on the page fail with 403s.
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const fallback = user?.role === "owner" ? "/owner-dashboard" : "/dashboard";
    return <Navigate to={fallback} replace />;
  }

  return <Outlet context={{ user }} />;
};

export default ProtectedRoute;