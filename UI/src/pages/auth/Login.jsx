import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  Boxes,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Loader2,
  Package,
  BarChart3,
  Users,
  ArrowUpRight,
  Quote,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast"

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

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [users, setUser] = useState({ email: "", password: "" });
  const navigate = useNavigate();

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

  return (
    <div className="flex min-h-screen flex-col bg-ink-950 md:flex-row">
      {/* LEFT: brand showcase panel - deliberately neutral/near-black,
          with color reserved for icons, chips and the CTA only. */}
      <div className="relative hidden overflow-hidden bg-ink-950 p-10 text-white md:flex md:w-1/2 md:flex-col md:justify-between lg:p-14">
        {/* Subtle dot-grid texture, faded toward the edges - texture
            instead of a big colored glow. */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />

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
            <h1 className="font-display text-2xl font-bold tracking-widest">SIMS</h1>
          </div>

          <h2 className="font-display text-3xl font-bold leading-snug lg:text-4xl">
            Stock Inventory Management, elevated.
          </h2>
          <p className="mt-4 text-white/50">
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
                className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-3"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-900/60 ring-1 ring-brand-700/40">
                  <f.icon className="h-3.5 w-3.5 text-brand-500" />
                </div>
                <span className="pt-0.5 text-xs leading-snug text-white/70">{f.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Live-preview mock card - adds a "product" feel without
              leaning on color, just structure and a hint of chart. */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-white/50">System Snapshot</span>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
              </span>
            </div>
            <div className="flex items-end gap-1">
              {[35, 55, 42, 70, 50, 85, 65, 58, 78, 45, 90, 68].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-sm bg-brand-700/50" style={{ height: `${h * 0.45}px` }} />
              ))}
            </div>
            <div className="mt-3 grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-3">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-display text-base font-bold text-white">{s.value}</p>
                  <p className="mt-0.5 text-[10px] text-white/40">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="relative z-10 mt-10 border-t border-white/10 pt-6"
        >
          <Quote className="h-5 w-5 text-brand-700" />
          <p className="mt-2 text-sm italic leading-relaxed text-white/60">
            "SIMS helped us cut stock discrepancies by more than 80%. Setup took an
            afternoon, not a month."
          </p>
          <div className="mt-3 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-900 text-xs font-bold text-brand-300 ring-1 ring-brand-700/40">
              J
            </div>
            <div>
              <p className="text-xs font-semibold text-white/80">John M.</p>
              <p className="text-[11px] text-white/40">Warehouse Manager</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT: login card */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-ink-950 p-6">
        <div
          className="pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] md:hidden"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-glow-lg"
        >
          <div className="flex flex-col items-center bg-ink-950 p-7">
            <div className="mb-3 rounded-xl bg-gradient-to-br from-brand-700 to-brand-900 p-3 shadow-glow">
              <Boxes className="h-8 w-8 text-white" />
            </div>
            <h1 className="font-display text-xl font-bold tracking-widest text-white">SIMS</h1>
          </div>

          <div className="p-6 sm:p-7">
            <h2 className="text-center font-display text-xl font-semibold text-white">Welcome back</h2>
            <p className="mb-6 text-center text-sm text-white/40">Login to your SIMS account</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  placeholder="Email"
                  value={users.email}
                  onChange={(e) => setUser({ ...users, email: e.target.value })}
                  className="input-field pl-9 !bg-white/5 !border-white/10 !text-white placeholder:!text-white/30 focus:!border-brand-600/60 focus:!ring-brand-600/20"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={users.password}
                  onChange={(e) => setUser({ ...users, password: e.target.value })}
                  className="input-field pl-9 pr-10 !bg-white/5 !border-white/10 !text-white placeholder:!text-white/30 focus:!border-brand-600/60 focus:!ring-brand-600/20"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-xs text-white/50">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 text-brand-600 focus:ring-brand-600/40 focus:ring-offset-0"
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

            <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-white/30">
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