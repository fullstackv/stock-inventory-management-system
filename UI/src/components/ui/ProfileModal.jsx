import { Mail, ShieldCheck, UserCircle2 } from "lucide-react";
import Modal from "./Modal";

/**
 * A simple, honest "Profile" view - it shows exactly what the session
 * actually holds (name, email, role) rather than inventing fields like
 * "member since" or a bio that the backend doesn't track. Editing isn't
 * wired up here since there's no backend endpoint for it yet; this is a
 * read-only summary.
 */
const ProfileModal = ({ isOpen, onClose, user }) => {
  const initial = (user?.names || "U").charAt(0).toUpperCase();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Profile" size="sm">
      <div className="flex flex-col items-center pb-2 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-700 to-brand-900 text-xl font-bold text-white shadow-glow">
          {initial}
        </div>
        <h3 className="mt-3 font-display text-lg font-semibold text-ink-900 dark:text-white">
          {user?.names || "User"}
        </h3>
        <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium capitalize text-brand-700 ring-1 ring-brand-100 dark:bg-brand-950/40 dark:text-brand-300 dark:ring-brand-900/50">
          <ShieldCheck size={12} /> {user?.role || "owner"}
        </span>
      </div>

      <div className="mt-5 space-y-2.5">
        <div className="flex items-center gap-3 rounded-xl border border-black/5 p-3 dark:border-white/10">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-ink-700/60 dark:bg-white/5 dark:text-white/50">
            <Mail size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-ink-700/50 dark:text-white/40">Email</p>
            <p className="truncate text-sm font-medium text-ink-900 dark:text-white">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-black/5 p-3 dark:border-white/10">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-ink-700/60 dark:bg-white/5 dark:text-white/50">
            <UserCircle2 size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-ink-700/50 dark:text-white/40">Account type</p>
            <p className="truncate text-sm font-medium capitalize text-ink-900 dark:text-white">
              {user?.role === "owner" ? "Owner (full access)" : "Store Keeper"}
            </p>
          </div>
        </div>
      </div>

      <button onClick={onClose} className="btn-secondary mt-6 w-full">
        Close
      </button>
    </Modal>
  );
};

export default ProfileModal;