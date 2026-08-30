import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../api/axios";

// allowedRoles: optional array (e.g. ["storekeeper"] or ["owner"]).
// Omit it to just require "logged in, any role" (used for /change-password).
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
      <div className="flex min-h-screen items-center justify-center bg-surface text-ink-700/50 dark:bg-ink-900 dark:text-white/50">
        Checking session...
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
    const fallback = user?.role === "owner" ? "/storekeepers" : "/dashboard";
    return <Navigate to={fallback} replace />;
  }

  return <Outlet context={{ user }} />;
};

export default ProtectedRoute;