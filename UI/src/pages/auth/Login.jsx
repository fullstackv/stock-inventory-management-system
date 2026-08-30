import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Boxes, CheckCircle2, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "sonner";

const features = [
  "Real-time inventory tracking",
  "Stock in & stock out management",
  "Advanced reporting & analytics",
  "Isolated, role-based system access",
];

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUser] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/login", users);
      toast.success(res.data.message);

      const { role } = res.data.user;
      // Storekeepers get straight into their account with the temp
      // credentials the owner gave them - changing the password is
      // available any time from the sidebar, not forced up front.
      navigate(role === "owner" ? "/storekeepers" : "/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-ink-900 md:flex-row">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-ink-900 via-[#26120c] to-brand-950 p-10 text-white md:flex md:w-1/2 md:items-center md:justify-center">
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-600/30 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-red-600/20 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative max-w-md">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-brand-500 to-red-500 p-3 shadow-glow">
              <Boxes className="h-8 w-8 text-white" />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-widest">SIMS</h1>
          </div>

          <h2 className="font-display text-2xl font-bold leading-snug">
            Stock Inventory Management, elevated.
          </h2>
          <p className="mt-4 text-white/60">
            Manage spares, suppliers, movements and analytics in one powerful system
            built for speed, accuracy, and efficiency.
          </p>

          <div className="mt-8 space-y-3">
            {features.map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="flex items-center gap-2.5"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-orange-400" />
                <span className="text-sm text-white/80">{f}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-surface p-6 dark:bg-ink-900">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-glow-lg dark:bg-ink-800"
        >
          <div className="flex flex-col items-center bg-gradient-to-r from-ink-900 via-[#26120c] to-brand-950 p-6">
            <div className="mb-3 rounded-xl bg-white/10 p-3">
              <Boxes className="h-9 w-9 text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-widest text-white">SIMS</h1>
          </div>

          <div className="p-6">
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-700/40 hover:text-ink-700 dark:text-white/30 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-ink-700/60 dark:text-white/40">
              Business owner and don't have an account?{" "}
              <Link to="/register" className="font-medium text-brand-600 hover:text-brand-700 hover:underline dark:text-brand-400">
                Sign up
              </Link>
            </p>
            <p className="mt-1.5 text-center text-xs text-ink-700/40 dark:text-white/30">
              Store keepers: your owner creates your account for you.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;