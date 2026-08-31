import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

// Portalled into <body> for the same reason as Modal.jsx - see the
// comment there. Without this, a transform left behind by an ancestor's
// `animate-fade-in` keyframe would clip this under the sticky header.
const ConfirmDialog = ({ isOpen, onClose, onConfirm, title = "Are you sure?", message, confirmLabel = "Delete", loading = false }) => {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-glow-lg text-center dark:bg-ink-800"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:ring-rose-500/20">
              <AlertTriangle size={22} className="text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-ink-900 dark:text-white">{title}</h3>
            {message && <p className="mt-1.5 text-sm text-ink-700/60 dark:text-white/40">{message}</p>}
            <div className="mt-6 flex gap-3">
              <button onClick={onClose} className="btn-secondary flex-1" disabled={loading}>
                Cancel
              </button>
              <button onClick={onConfirm} className="btn-danger flex-1" disabled={loading}>
                {loading ? "Working..." : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ConfirmDialog;