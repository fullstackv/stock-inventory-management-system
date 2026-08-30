import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Bell, Search, AlertTriangle, Sun, Moon } from "lucide-react";
import api from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/spares": "Spares Inventory",
  "/stock-in": "Stock In",
  "/stock-out": "Stock Out",
  "/stock-adjustments": "Stock Adjustments",
  "/categories": "Categories",
  "/suppliers": "Suppliers",
  "/reports": "Reports & Analytics",
  "/storekeepers": "Store Keepers",
};

const Header = ({ setMobileOpen, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [lowStock, setLowStock] = useState([]);
  const notifRef = useRef(null);

  const title = pageTitles[location.pathname] || "SIMS";
  const isStorekeeper = user?.role !== "owner";

  useEffect(() => {
    if (!isStorekeeper) return;
    const fetchLowStock = async () => {
      try {
        const res = await api.get("/spares", { params: { lowStockOnly: "true", limit: 6 } });
        setLowStock(res.data.data || []);
      } catch (error) {
        console.error("Fetch low stock error:", error);
      }
    };
    fetchLowStock();
    const interval = setInterval(fetchLowStock, 60000);
    return () => clearInterval(interval);
  }, [location.pathname, isStorekeeper]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/spares?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-black/5 bg-white/80 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/80 sm:px-6">
      <button
        onClick={() => setMobileOpen(true)}
        className="rounded-lg p-2 text-ink-700 hover:bg-slate-100 dark:text-white/70 dark:hover:bg-white/10 lg:hidden"
      >
        <Menu size={20} />
      </button>

      <h1 className="hidden font-display text-lg font-semibold text-ink-900 dark:text-white sm:block">{title}</h1>

      {isStorekeeper && (
        <form onSubmit={handleSearchSubmit} className="ml-auto flex-1 sm:ml-6 sm:max-w-xs">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-700/40 dark:text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search spares by name or SKU..."
              className="input-field !py-2 pl-9 text-sm"
            />
          </div>
        </form>
      )}

      <button
        onClick={toggleTheme}
        className={`rounded-lg p-2 text-ink-700 transition-colors hover:bg-slate-100 dark:text-white/70 dark:hover:bg-white/10 ${!isStorekeeper ? "ml-auto" : ""}`}
        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
            className="block"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </motion.span>
        </AnimatePresence>
      </button>

      {isStorekeeper && (
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative rounded-lg p-2 text-ink-700 transition-colors hover:bg-slate-100 dark:text-white/70 dark:hover:bg-white/10"
          >
            <Bell size={20} />
            {lowStock.length > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-rose-400" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
              </span>
            )}
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-glow-lg dark:border-white/10 dark:bg-ink-800"
              >
                <div className="border-b border-black/5 bg-gradient-to-r from-brand-50 to-red-50 px-4 py-3 dark:border-white/10 dark:from-brand-950/40 dark:to-red-950/20">
                  <p className="text-sm font-semibold text-ink-900 dark:text-white">Low stock alerts</p>
                  <p className="text-xs text-ink-700/50 dark:text-white/40">{lowStock.length} item(s) at or below reorder level</p>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {lowStock.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-ink-700/40 dark:text-white/30">All stock levels are healthy 🎉</p>
                  ) : (
                    lowStock.map((item) => (
                      <div key={item._id} className="flex items-center gap-3 border-b border-black/5 px-4 py-3 last:border-0 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5">
                        <div className="rounded-lg bg-amber-50 p-1.5 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                          <AlertTriangle size={14} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-ink-900 dark:text-white">{item.name}</p>
                          <p className="text-xs text-ink-700/50 dark:text-white/40">
                            {item.quantity} left · reorder at {item.minStockLevel}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {lowStock.length > 0 && (
                  <button
                    onClick={() => { setNotifOpen(false); navigate("/spares?lowStockOnly=true"); }}
                    className="block w-full border-t border-black/5 px-4 py-2.5 text-center text-xs font-semibold text-brand-600 hover:bg-brand-50 dark:border-white/10 dark:text-brand-400 dark:hover:bg-white/5"
                  >
                    View all low stock items
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-red-500 text-sm font-bold text-white sm:flex">
        {(user?.names || "U").charAt(0).toUpperCase()}
      </div>
    </header>
  );
};

export default Header;
