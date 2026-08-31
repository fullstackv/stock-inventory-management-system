import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, LogOut, Settings, UserCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import ProfileModal from "./ProfileModal";
import SettingsModal from "./SettingsModal";
import ChangePasswordModal from "./ChangePasswordModal";
import LogoutConfirmModal from "./LogoutConfirmModal";

const menuMotion = {
  initial: { opacity: 0, scale: 0.96, y: -6 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.97, y: -4 },
  transition: { duration: 0.15, ease: "easeOut" },
};

/**
 * The one place "Profile / Settings / Logout" lives - used both by the
 * header (top-right, compact avatar trigger) and the sidebar (bottom,
 * full-width row trigger, menu opens upward since it's screen-bottom).
 * Both owner and storekeeper get the exact same menu; nothing here is
 * role-specific, so there's only one component to keep in sync.
 */
const UserMenu = ({ user, variant = "header", collapsed = false }) => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const rootRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const res = await api.post("/logout", {});
      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    } finally {
      setLoggingOut(false);
      setLogoutOpen(false);
    }
  };

  const initial = (user?.names || "U").charAt(0).toUpperCase();

  const menuItems = [
    { icon: UserCircle2, label: "Profile", onClick: () => { setOpen(false); setProfileOpen(true); } },
    { icon: Settings, label: "Settings", onClick: () => { setOpen(false); setSettingsOpen(true); } },
  ];

  const isHeader = variant === "header";

  return (
    <div ref={rootRef} className="relative">
      {isHeader ? (
        <button
          onClick={() => setOpen((o) => !o)}
          className="group flex items-center gap-1.5 rounded-full p-0.5 transition-all hover:ring-2 hover:ring-brand-500/30"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-700 to-brand-900 text-sm font-bold text-white shadow-glow">
            {initial}
          </div>
        </button>
      ) : collapsed ? (
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-center rounded-xl p-2 transition-colors hover:bg-white/5"
          title={user?.names || "Account"}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-700 to-brand-900 text-sm font-bold text-white">
            {initial}
          </div>
        </button>
      ) : (
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-white/5"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-700 to-brand-900 text-sm font-bold text-white">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{user?.names || "User"}</p>
            <p className="truncate text-xs text-white/40 capitalize">{user?.role || "owner"}</p>
          </div>
          {open ? <ChevronUp size={15} className="shrink-0 text-white/40" /> : <ChevronDown size={15} className="shrink-0 text-white/40" />}
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            {...menuMotion}
            className={`absolute z-40 w-64 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-glow-lg dark:border-white/10 dark:bg-ink-800
              ${isHeader ? "right-0 top-full mt-2" : collapsed ? "bottom-0 left-full ml-2" : "bottom-full left-0 mb-2"}`}
          >
            <div className="border-b border-black/5 bg-slate-50 px-4 py-3.5 dark:border-white/10 dark:bg-white/5">
              <p className="truncate text-sm font-semibold text-ink-900 dark:text-white">{user?.names || "User"}</p>
              <p className="truncate text-xs text-ink-700/50 dark:text-white/40">{user?.email}</p>
            </div>

            <div className="p-1.5">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-800 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-white/70 dark:hover:bg-brand-950/40 dark:hover:text-brand-300"
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              ))}
              <div className="my-1.5 border-t border-black/5 dark:border-white/10" />
              <button
                onClick={() => { setOpen(false); setLogoutOpen(true); }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} user={user} />
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onChangePassword={() => { setSettingsOpen(false); setChangePasswordOpen(true); }}
      />
      <ChangePasswordModal
        isOpen={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        mustChange={user?.mustChangePassword}
      />
      <LogoutConfirmModal
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
        loading={loggingOut}
        userName={user?.names}
      />
    </div>
  );
};

export default UserMenu;