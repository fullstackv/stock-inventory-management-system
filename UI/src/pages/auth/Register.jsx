import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, Eye, EyeOff, Boxes, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../api/axios";

const features = [
  "Create and manage store keeper accounts",
  "Each store keeper's inventory stays isolated",
  "Deactivate access instantly, any time",
  "Full audit trail of every action",
];

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullnames: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/register", form);
      toast.success(res.data.message);
      setForm({ fullnames: "", email: "", phone: "", password: "" });
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.error || "Registration failed, please try again.");
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

          <h2 className="font-display text-2xl font-bold leading-snug brand-gradient-text">
            Create your owner account.
          </h2>
          <p className="mt-4 text-white/60">
            As the business owner, you create and manage store keeper accounts.
            Each store keeper then runs their own fully isolated inventory.
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
          className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-glow-lg dark:bg-ink-800"
        >
          <div className="flex flex-col items-center bg-gradient-to-r from-ink-900 via-[#26120c] to-brand-950 p-6">
            <div className="mb-3 rounded-xl bg-white/10 p-3">
              <Boxes className="h-9 w-9 text-white" />
            </div>
            <h1 className="font-display text-xl font-bold tracking-widest text-white">OWNER ACCOUNT</h1>
          </div>

          <div className="p-6">
            <p className="mb-6 text-center text-sm text-ink-700/50 dark:text-white/40">
              Sign up as the business owner to start managing store keepers
            </p>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-700/40 dark:text-white/30" />
                <input
                  type="text" name="fullnames" value={form.fullnames}
                  placeholder="Full Names" onChange={handleChange} className="input-field pl-9" required
                />
              </div>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-700/40 dark:text-white/30" />
                <input
                  type="email" name="email" value={form.email}
                  placeholder="Email Address" onChange={handleChange} className="input-field pl-9" required
                />
              </div>

              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-700/40 dark:text-white/30" />
                <input
                  type="text" name="phone" value={form.phone}
                  placeholder="Phone Number" onChange={handleChange} className="input-field pl-9" required
                />
              </div>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-700/40 dark:text-white/30" />
                <input
                  type={showPassword ? "text" : "password"} name="password" value={form.password}
                  placeholder="Password" onChange={handleChange} className="input-field pl-9 pr-10" required
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
                {loading ? "Creating account..." : "Create Owner Account"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-ink-700/60 dark:text-white/40">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700 hover:underline dark:text-brand-400">
                Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
