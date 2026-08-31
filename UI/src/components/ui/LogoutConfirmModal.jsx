import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Boxes } from "lucide-react";

/**
 * A friendlier, more polished confirmation for logging out - distinct from
 * the generic destructive-action ConfirmDialog (this isn't a destructive
 * action, so it gets its own warmer visual treatment).
 *
 * Portalled into <body> for the same reason as Modal.jsx / ConfirmDialog.jsx.
 */
const LogoutConfirmModal = ({ isOpen, onClose, onConfirm, loading = false, userName }) => {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={loading ? undefined : onClose}
            className="absolute inset-0 bg-ink-900/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-glow-lg dark:bg-ink-800"
          >
            {/* Decorative header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-ink-900 via-ink-800 to-brand-950 px-6 pb-10 pt-8 text-center">
              <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-brand-500/20 blur-3xl animate-float" />
              <div
                className="pointer-events-none absolute -right-8 bottom-0 h-32 w-32 rounded-full bg-red-500/20 blur-3xl animate-float"
                style={{ animationDelay: "1s" }}
              />
              <motion.div
                initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ delay: 0.05, type: "spring", stiffness: 260, damping: 18 }}
                className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur"
              >
                <Boxes className="h-8 w-8 text-white" />
                <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-red-500 shadow-glow ring-4 ring-ink-900">
                  <LogOut size={14} className="text-white" />
                </div>
              </motion.div>
            </div>

            <div className="px-6 pb-6 pt-5 text-center">
              <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-white">
                Log out{userName ? `, ${userName.split(" ")[0]}` : ""}?
              </h3>
              <p className="mt-1.5 text-sm text-ink-700/60 dark:text-white/40">
                You'll need to sign back in with your credentials to access SIMS again.
              </p>

              <div className="mt-6 flex gap-3">
                <button onClick={onClose} className="btn-secondary flex-1" disabled={loading}>
                  Stay logged in
                </button>
                <button onClick={onConfirm} className="btn-danger flex-1" disabled={loading}>
                  <LogOut size={15} />
                  {loading ? "Logging out..." : "Log out"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default LogoutConfirmModal;