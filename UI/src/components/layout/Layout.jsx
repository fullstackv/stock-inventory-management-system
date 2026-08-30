import { useState } from "react";
import { Outlet, Navigate, useLocation, useOutletContext } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const OWNER_HOME = "/storekeepers";
const STOREKEEPER_HOME = "/dashboard";

const Layout = () => {
  const { user } = useOutletContext();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  if (!user) return null;

  // These checks happen BEFORE anything below is rendered, so a
  // mismatched route (e.g. an owner landing on /dashboard) redirects
  // immediately instead of briefly mounting Header/Dashboard first -
  // which is what was firing /analytics and /spares requests that the
  // backend correctly rejected with 403 before the redirect could run.
  if (user.role === "storekeeper" && user.mustChangePassword) {
    return <Navigate to="/change-password" replace />;
  }
  if (user.role === "owner" && !location.pathname.startsWith("/storekeepers")) {
    return <Navigate to={OWNER_HOME} replace />;
  }
  if (user.role === "storekeeper" && location.pathname.startsWith("/storekeepers")) {
    return <Navigate to={STOREKEEPER_HOME} replace />;
  }

  return (
    <div className="flex min-h-screen bg-surface dark:bg-ink-900">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        user={user}
      />
      <div className="flex min-h-screen flex-1 flex-col lg:min-w-0">
        <Header setMobileOpen={setMobileOpen} user={user} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;