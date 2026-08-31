import { KeyRound, Moon, Sun } from "lucide-react";
import Modal from "./Modal";
import { useTheme } from "../../context/ThemeContext";

/**
 * Account settings. Kept intentionally small and honest: appearance
 * (the theme toggle already lives in the header, this just surfaces the
 * same control somewhere more discoverable) and a way into changing your
 * password. No fake toggles for features the backend doesn't support.
 */
const SettingsModal = ({ isOpen, onClose, onChangePassword }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" size="sm">
      <div className="space-y-3">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-700/50 dark:text-white/40">
            Appearance
          </p>
          <button
            onClick={toggleTheme}
            className="flex w-full items-center justify-between rounded-xl border border-black/5 p-3.5 text-left transition-colors hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-ink-700/60 dark:bg-white/5 dark:text-white/50">
                {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
              </div>
              <div>
                <p className="text-sm font-medium text-ink-900 dark:text-white">Theme</p>
                <p className="text-xs text-ink-700/50 dark:text-white/40">
                  Currently {theme === "dark" ? "dark" : "light"} mode
                </p>
              </div>
            </div>
            <span
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                theme === "dark" ? "bg-brand-700" : "bg-slate-200"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  theme === "dark" ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </span>
          </button>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-700/50 dark:text-white/40">
            Security
          </p>
          <button
            onClick={onChangePassword}
            className="flex w-full items-center gap-3 rounded-xl border border-black/5 p-3.5 text-left transition-colors hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-ink-700/60 dark:bg-white/5 dark:text-white/50">
              <KeyRound size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-ink-900 dark:text-white">Change password</p>
              <p className="text-xs text-ink-700/50 dark:text-white/40">Update your account password</p>
            </div>
          </button>
        </div>
      </div>

      <button onClick={onClose} className="btn-secondary mt-6 w-full">
        Close
      </button>
    </Modal>
  );
};

export default SettingsModal;