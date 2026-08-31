import { useState } from "react";
import { KeyRound, Eye, EyeOff, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast"
import api from "../../api/axios";
import Modal from "./Modal";

const emptyForm = { currentPassword: "", newPassword: "", confirmPassword: "" };

/**
 * Change-password flow, as a modal instead of a dedicated page. Used both
 * for a voluntary password change (opened from the sidebar) and the
 * "you're still using your temporary password" nudge banner - `mustChange`
 * just tweaks the copy, it doesn't change the behavior.
 *
 * On success we do a full page reload rather than a client-side state
 * update: mustChangePassword just flipped server-side, and reloading is
 * the simplest way to get every part of the app (session, banners, nav)
 * working off the fresh value instead of a stale cached one.
 */
const ChangePasswordModal = ({ isOpen, onClose, mustChange = false }) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const handleClose = () => {
    if (loading) return;
    setForm(emptyForm);
    onClose();
  };

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
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Change Password" size="sm">
      <div className="mb-5 flex items-start gap-3 rounded-xl bg-brand-50 p-3.5 text-sm text-brand-800 ring-1 ring-brand-100 dark:bg-brand-950/40 dark:text-brand-300 dark:ring-brand-900/50">
        <ShieldCheck size={18} className="mt-0.5 shrink-0" />
        <p>
          {mustChange
            ? "For security, we recommend setting your own password instead of the temporary one your owner gave you."
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
            autoFocus
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

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={handleClose} className="btn-secondary flex-1" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary flex-1" disabled={loading}>
            {loading ? "Updating..." : "Set New Password"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;
