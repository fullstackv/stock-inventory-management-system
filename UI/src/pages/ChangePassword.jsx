import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { KeyRound, Eye, EyeOff, Boxes, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import api from "../api/axios";

const ChangePassword = () => {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (form.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await api.put("/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success(res.data.message);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-ink-900 via-[#26120c] to-brand-950 p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-glow-lg dark:bg-ink-800"
      >
        <div className="flex flex-col items-center bg-gradient-to-r from-ink-900 via-[#26120c] to-brand-950 p-6">
          <div className="mb-3 rounded-xl bg-white/10 p-3">
            <Boxes className="h-9 w-9 text-white" />
          </div>
          <h1 className="font-display text-xl font-bold tracking-widest text-white">SIMS</h1>
        </div>

        <div className="p-6">
          <div className="mb-5 flex items-start gap-3 rounded-xl bg-brand-50 p-3.5 text-sm text-brand-800 ring-1 ring-brand-100 dark:bg-brand-950/40 dark:text-brand-300 dark:ring-brand-900/50">
            <ShieldCheck size={18} className="mt-0.5 shrink-0" />
            <p>
              {user?.mustChangePassword
                ? "For security, you must set a new password before continuing."
                : "Update your account password."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-700/40 dark:text-white/30" />
              <input
                type={showCurrent ? "text" : "password"}
                placeholder="Current (temporary) password"
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                className="input-field pl-9 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-700/40 hover:text-ink-700 dark:text-white/30 dark:hover:text-white"
              >
                {showCurrent ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-700/40 dark:text-white/30" />
              <input
                type={showNew ? "text" : "password"}
                placeholder="New password"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className="input-field pl-9 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-700/40 hover:text-ink-700 dark:text-white/30 dark:hover:text-white"
              >
                {showNew ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-700/40 dark:text-white/30" />
              <input
                type={showNew ? "text" : "password"}
                placeholder="Confirm new password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="input-field pl-9"
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Updating..." : "Set New Password"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
