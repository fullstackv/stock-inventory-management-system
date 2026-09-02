import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  Boxes,
  Mail,
  ShieldCheck,
  Loader2,
  Package,
  BarChart3,
  Users,
  ArrowUpRight,
  Quote,
  Sun,
  Moon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast"
import { useTheme } from "../../context/ThemeContext";

const REMEMBER_KEY = "sims_remembered_email";

const features = [
  { icon: Package, text: "Real-time inventory tracking" },
  { icon: ArrowUpRight, text: "Stock in & stock out management" },
  { icon: BarChart3, text: "Advanced reporting & analytics" },
  { icon: Users, text: "Isolated, role-based system access" },
];

const stats = [
  { value: "99%", label: "Tracking Accuracy" },
  { value: "24/7", label: "Availability" },
  { value: "1", label: "Owner, Full Control" },
];

// Theme toggle sits on the login page itself - people land here before
// they're ever inside the app, so they shouldn't have to log in once
// just to switch away from a theme that's uncomfortable to read.
const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/80 text-ink-700 shadow-card backdrop-blur-xl transition-colors hover:bg-brand-50 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 ${className}`}
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
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [users, setUser] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    document.title = "Login · SIMS";
  }, []);

  // Small, honest convenience feature: remember the email (never the
  // password) locally so a returning user doesn't have to retype it.
  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) {
      setUser((u) => ({ ...u, email: saved }));
      setRemember(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/login", users);
      toast.success(res.data.message);

      if (remember) {
        localStorage.setItem(REMEMBER_KEY, users.email);
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      const { role } = res.data.user;
      // Storekeepers get straight into their account with the temp
      // credentials the owner gave them - changing the password is
      // available any time from the sidebar, not forced up front.
      navigate(role === "owner" ? "/owner-dashboard" : "/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Dot-grid texture color needs to invert with theme - it's drawn via an
  // inline backgroundImage (not a Tailwind class), so it can't pick up a
  // dark: variant the normal way.
  const dotColor = theme === "dark" ? "rgba(255,255,255,0.09)" : "rgba(17,17,17,0.05)";

  return (
    <div className="relative flex min-h-screen flex-col bg-white transition-colors duration-300 dark:bg-ink-950 md:flex-row">
      <ThemeToggle className="fixed right-4 top-4 z-50" />

      {/* LEFT: brand showcase panel - color reserved for icons, chips and
          the CTA only, so it stays legible and on-brand in either theme. */}
      <div className="relative hidden overflow-hidden bg-white p-10 dark:bg-ink-950 md:flex md:w-1/2 md:flex-col md:justify-between lg:p-14">
        {/* Subtle dot-grid texture, faded toward the edges - texture
            instead of a big colored glow. */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
          style={{
            backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 dark:to-black/40" />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-md"
        >
          <div className="mb-9 flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-brand-700 to-brand-900 p-3 shadow-glow">
              <Boxes className="h-7 w-7 text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-widest text-ink-900 dark:text-white">SIMS</h1>
          </div>

          <h2 className="font-display text-3xl font-bold leading-snug text-ink-900 dark:text-white lg:text-4xl">
            Stock Inventory Management, elevated.
          </h2>
          <p className="mt-4 text-ink-700/60 dark:text-white/50">
            Manage spares, suppliers, movements and analytics in one powerful system
            built for speed, accuracy, and efficiency.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {features.map((f, i) => (
              <motion.div
                key={f.text}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07 }}
                className="flex items-start gap-2.5 rounded-xl border border-black/5 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.03]"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-100 ring-1 ring-brand-200 dark:bg-brand-900/60 dark:ring-brand-700/40">
                  <f.icon className="h-3.5 w-3.5 text-brand-600 dark:text-brand-500" />
                </div>
                <span className="pt-0.5 text-xs leading-snug text-ink-700/70 dark:text-white/70">{f.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Live-preview mock card - adds a "product" feel without
              leaning on color, just structure and a hint of chart. */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-8 rounded-2xl border border-black/5 bg-black/[0.02] p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.03]"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-ink-700/60 dark:text-white/50">System Snapshot</span>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse dark:bg-emerald-400" /> Live
              </span>
            </div>
            <div className="flex items-end gap-1">
              {[35, 55, 42, 70, 50, 85, 65, 58, 78, 45, 90, 68].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-sm bg-brand-400/70 dark:bg-brand-700/50" style={{ height: `${h * 0.45}px` }} />
              ))}
            </div>
            <div className="mt-3 grid grid-cols-3 divide-x divide-black/10 border-t border-black/10 pt-3 dark:divide-white/10 dark:border-white/10">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-display text-base font-bold text-ink-900 dark:text-white">{s.value}</p>
                  <p className="mt-0.5 text-[10px] text-ink-700/50 dark:text-white/40">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="relative z-10 mt-10 border-t border-black/10 pt-6 dark:border-white/10"
        >
          <Quote className="h-5 w-5 text-brand-600 dark:text-brand-500" />
          <p className="mt-2 text-sm italic leading-relaxed text-ink-700/70 dark:text-white/60">
            "SIMS helped us cut stock discrepancies by more than 80%. Setup took an
            afternoon, not a month."
          </p>
          <div className="mt-3 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 ring-1 ring-brand-200 dark:bg-brand-900 dark:text-brand-300 dark:ring-brand-700/40">
              J
            </div>
            <div>
              <p className="text-xs font-semibold text-ink-800 dark:text-white/80">John M.</p>
              <p className="text-[11px] text-ink-700/50 dark:text-white/40">Warehouse Manager</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT: login card */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-surface p-6 dark:bg-ink-950">
        <div
          className="pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] md:hidden"
          style={{
            backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px)`,
            backgroundSize: "22px 22px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-black/5 bg-white shadow-glow-lg dark:border-white/10 dark:bg-ink-900"
        >
          <div className="flex flex-col items-center border-b border-black/5 bg-gradient-to-br from-brand-50 to-white p-7 dark:border-white/5 dark:from-ink-950 dark:to-ink-950">
            <div className="mb-3 rounded-xl bg-gradient-to-br from-brand-700 to-brand-900 p-3 shadow-glow">
              <Boxes className="h-8 w-8 text-white" />
            </div>
            <h1 className="font-display text-xl font-bold tracking-widest text-ink-900 dark:text-white">SIMS</h1>
          </div>

          <div className="p-6 sm:p-7">
            <h2 className="text-center font-display text-xl font-semibold text-ink-900 dark:text-white">Welcome back</h2>
            <p className="mb-6 text-center text-sm text-ink-700/50 dark:text-white/40">Login to your SIMS account</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-700/40 dark:text-white/30" />
                <input
                  type="email"
                  placeholder="Email"
                  value={users.email}
                  onChange={(e) => setUser({ ...users, email: e.target.value })}
                  className="input-field pl-9"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-700/40 dark:text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={users.password}
                  onChange={(e) => setUser({ ...users, password: e.target.value })}
                  className="input-field pl-9 pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-700/40 hover:text-ink-900 dark:text-white/30 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-xs text-ink-700/60 dark:text-white/50">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-black/20 bg-white text-brand-600 focus:ring-brand-600/40 focus:ring-offset-0 dark:border-white/20 dark:bg-white/5"
                />
                Remember my email on this device
              </label>

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-ink-700/40 dark:text-white/30">
              <ShieldCheck size={12} />
              Your session is encrypted and access is role-restricted.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;