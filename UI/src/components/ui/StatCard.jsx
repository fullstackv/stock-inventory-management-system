import { motion } from "framer-motion";
import CountUp from "react-countup";

/**
 * Animated KPI card used across the Dashboard.
 * `tone` picks an accent gradient; `trend` (optional) shows a % delta pill.
 */
const toneMap = {
  brand: "from-brand-500 to-red-500",
  success: "from-emerald-500 to-teal-500",
  warning: "from-amber-500 to-orange-500",
  danger: "from-rose-500 to-red-500",
  info: "from-cyan-500 to-sky-500",
};

const StatCard = ({ icon: Icon, label, value, prefix = "", suffix = "", decimals = 0, tone = "brand", trend, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="card relative overflow-hidden p-5"
    >
      <div
        className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${toneMap[tone]} opacity-10 blur-2xl`}
      />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-700/50 dark:text-white/40">{label}</p>
          <p className="mt-2 font-display text-2xl font-bold text-ink-900 dark:text-white sm:text-3xl">
            {prefix}
            <CountUp end={Number(value) || 0} duration={1.2} separator="," decimals={decimals} />
            {suffix}
          </p>
          {subtitle && <p className="mt-1 text-xs text-ink-700/50 dark:text-white/40">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`rounded-xl bg-gradient-to-br ${toneMap[tone]} p-2.5 shadow-glow`}>
            <Icon size={20} className="text-white" strokeWidth={2.2} />
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div className="mt-3 flex items-center gap-1">
          <span
            className={`badge ${trend >= 0 ? "badge-success" : "badge-danger"}`}
          >
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
          <span className="text-xs text-ink-700/40 dark:text-white/30">vs last month</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
