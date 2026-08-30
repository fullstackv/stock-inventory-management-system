import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  SlidersHorizontal,
  Tags,
  Truck,
  FileBarChart2,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  Boxes,
  X,
  Users,
  KeyRound,
} from "lucide-react";
import { toast } from "sonner";
import api from "../../api/axios";

const storekeeperNav = [
  {
    label: "Overview",
    items: [{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Inventory",
    items: [
      { to: "/spares", label: "Spares", icon: Package },
      { to: "/stock-in", label: "Stock In", icon: ArrowDownToLine },
      { to: "/stock-out", label: "Stock Out", icon: ArrowUpFromLine },
      { to: "/stock-adjustments", label: "Adjustments", icon: SlidersHorizontal },
    ],
  },
  {
    label: "Catalog",
    items: [
      { to: "/categories", label: "Categories", icon: Tags },
      { to: "/suppliers", label: "Suppliers", icon: Truck },
    ],
  },
  {
    label: "Insights",
    items: [{ to: "/reports", label: "Reports", icon: FileBarChart2 }],
  },
];

const ownerNav = [
  {
    label: "Administration",
    items: [{ to: "/storekeepers", label: "Store Keepers", icon: Users }],
  },
];

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen, user }) => {
  const navigate = useNavigate();
  const navSections = user?.role === "owner" ? ownerNav : storekeeperNav;

  const handleLogout = async () => {
    try {
      const res = await api.post("/logout", {});
      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const NavItem = ({ to, label, icon: Icon }) => (
    <NavLink
      to={to}
      onClick={() => setMobileOpen(false)}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200
         ${isActive ? "text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="active-nav-pill"
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-600 to-red-500 shadow-glow"
            />
          )}
          <Icon size={18} className="relative z-10 shrink-0" strokeWidth={2} />
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="relative z-10 whitespace-nowrap overflow-hidden"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </>
      )}
    </NavLink>
  );

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-ink-900/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-gradient-to-b from-ink-900 via-[#26120c] to-ink-900
          border-r border-white/5 shadow-2xl
          lg:translate-x-0 lg:static
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 lg:transition-none`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-4">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-red-500 shadow-glow animate-float">
              <Boxes size={18} className="text-white" />
            </div>
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-display text-base font-bold text-white whitespace-nowrap overflow-hidden"
                >
                  SIMS
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-white/60 hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {navSections.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                  {section.label}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavItem key={item.to} {...item} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="hidden border-t border-white/5 p-3 lg:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white"
          >
            {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
            {!collapsed && "Collapse"}
          </button>
        </div>

        <div className="border-t border-white/5 p-3 space-y-1">
          <NavLink
            to="/change-password"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-2 py-2 text-xs font-medium transition-colors
               ${isActive ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"}
               ${collapsed ? "justify-center" : ""}`
            }
            title="Change Password"
          >
            <KeyRound size={16} className="shrink-0" />
            {!collapsed && "Change Password"}
          </NavLink>

          <div className={`flex items-center gap-3 rounded-xl px-2 py-2 ${collapsed ? "justify-center" : ""}`}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-red-500 text-sm font-bold text-white">
              {(user?.names || "U").charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{user?.names || "User"}</p>
                <p className="truncate text-xs text-white/40 capitalize">{user?.role || "owner"}</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={handleLogout}
                title="Logout"
                className="shrink-0 rounded-lg p-2 text-white/40 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
          {collapsed && (
            <button
              onClick={handleLogout}
              title="Logout"
              className="mt-2 flex w-full items-center justify-center rounded-lg p-2 text-white/40 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;