import { useState } from "react";
import { Outlet, Navigate, useLocation, useOutletContext } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ChangePasswordModal from "../ui/ChangePasswordModal";

const OWNER_HOME = "/owner-dashboard";
const STOREKEEPER_HOME = "/dashboard";

const Layout = () => {
  const { user } = useOutletContext();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const location = useLocation();

  if (!user) return null;

  // These checks happen BEFORE anything below is rendered, so a
  // mismatched route (e.g. an owner landing on /dashboard) redirects
  // immediately instead of briefly mounting Header/Dashboard first -
  // which is what was firing /analytics and /spares requests that the
  // backend correctly rejected with 403 before the redirect could run.
  const isOwnerRoute = location.pathname.startsWith("/storekeepers") || location.pathname.startsWith("/owner-dashboard");
  if (user.role === "owner" && !isOwnerRoute) {
    return <Navigate to={OWNER_HOME} replace />;
  }
  if (user.role === "storekeeper" && isOwnerRoute) {
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
          {user.mustChangePassword && (
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20">
              <ShieldAlert size={18} className="shrink-0" />
              <p className="flex-1">
                You're still using the temporary password your owner gave you. We recommend setting your own.
              </p>
              <button
                onClick={() => setChangePasswordOpen(true)}
                className="shrink-0 font-semibold underline underline-offset-2 hover:no-underline"
              >
                Change it now
              </button>
            </div>
          )}
          <Outlet context={{ user }} />
        </main>
      </div>
      <ChangePasswordModal isOpen={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} mustChange={user.mustChangePassword} />
    </div>
  );
};

export default Layout;