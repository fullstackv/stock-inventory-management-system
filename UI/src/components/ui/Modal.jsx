import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  const sizes = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  // Rendered via a portal straight into <body>, NOT in place. Several
  // pages wrap their content in a div with the `animate-fade-in` class,
  // which uses a transform-based keyframe animation. Even after that
  // animation finishes, `animation-fill-mode: both` leaves a computed
  // `transform: translateY(0)` on the element permanently - and any
  // non-`none` transform on an ancestor creates a new containing block
  // for `position: fixed` descendants. Without the portal, this modal's
  // "fixed inset-0" would be positioned relative to that ancestor
  // (which starts below the sticky header) instead of the real
  // viewport, clipping the modal's top edge under the header. Portalling
  // to document.body sidesteps that entirely, regardless of what any
  // future ancestor does with transform/filter/etc.
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`relative w-full ${sizes[size]} max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-glow-lg dark:bg-ink-800`}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-white/90 backdrop-blur px-6 py-4 dark:border-white/10 dark:bg-ink-800/90">
              <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-white">{title}</h3>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-ink-700/50 transition-colors hover:bg-slate-100 hover:text-ink-900 dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;