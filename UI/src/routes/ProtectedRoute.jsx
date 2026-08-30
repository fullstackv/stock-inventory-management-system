import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../api/axios";

const ProtectedRoute = () => {
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

  return authStatus === "authenticated" ? <Outlet context={{ user }} /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
