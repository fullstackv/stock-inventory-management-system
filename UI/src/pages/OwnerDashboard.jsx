import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Users, UserCheck, UserX, KeyRound, RefreshCw, AlertTriangle,
  UserPlus, Pencil, Power, Trash2, LogIn, Activity, ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast"
import api from "../api/axios";
import StatCard from "../components/ui/StatCard";

const STATUS_COLORS = { Active: "#10b981", Inactive: "#f43f5e", "Pending setup": "#f59e0b" };

const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const actionIcon = (action) => {
  if (action.includes("CREATE")) return <UserPlus size={14} className="text-emerald-600 dark:text-emerald-400" />;
  if (action.includes("UPDATE")) return <Pencil size={14} className="text-brand-600 dark:text-brand-400" />;
  if (action.includes("ACTIVATE") || action.includes("DEACTIVATE")) return <Power size={14} className="text-amber-600 dark:text-amber-400" />;
  if (action.includes("DELETE")) return <Trash2 size={14} className="text-rose-600 dark:text-rose-400" />;
  if (action.includes("RESET")) return <KeyRound size={14} className="text-cyan-600 dark:text-cyan-400" />;
  if (action.includes("LOGIN")) return <LogIn size={14} className="text-brand-600 dark:text-brand-400" />;
  return <Activity size={14} className="text-brand-600 dark:text-brand-400" />;
};

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchOverview = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.get("/storekeepers/overview");
      setData(res.data);
    } catch (error) {
      console.error("Fetch owner overview error:", error);
      const message = error.response?.data?.error || error.message || "Failed to load dashboard";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28" />)}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="skeleton h-80 lg:col-span-2" />
          <div className="skeleton h-80" />
        </div>
      </div>
    );
  }

  if (errorMessage || !data) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center gap-3 rounded-2xl border border-black/5 bg-white p-16 text-center dark:border-white/10 dark:bg-ink-800">
        <AlertTriangle size={36} className="text-rose-400" />
        <p className="font-display font-semibold text-ink-900 dark:text-white">Couldn't load the dashboard</p>
        <p className="max-w-md text-sm text-ink-700/50 dark:text-white/40">{errorMessage || "No data was returned."}</p>
        <button onClick={fetchOverview} className="btn-primary mt-2">
          <RefreshCw size={15} /> Try again
        </button>
      </div>
    );
  }

  const { summary, growthTrend, recentStorekeepers, recentActivity, statusBreakdown } = data;

  const statusDistribution = [
    { name: "Active", value: statusBreakdown.settledActive },
    { name: "Pending setup", value: statusBreakdown.pendingActive },
    { name: "Inactive", value: statusBreakdown.inactive },
  ].filter((d) => d.value > 0);

  return (
    <div className="animate-fade-in space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Store Keepers" value={summary.totalStorekeepers} tone="brand" subtitle={`${summary.newThisMonth} added this month`} />
        <StatCard icon={UserCheck} label="Active" value={summary.activeCount} tone="success" />
        <StatCard icon={UserX} label="Deactivated" value={summary.inactiveCount} tone="danger" />
        <StatCard icon={KeyRound} label="Pending Setup" value={summary.pendingSetupCount} tone="warning" subtitle="Still on temporary password" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-5 lg:col-span-2">
          <div className="mb-4">
            <h3 className="font-display font-semibold text-ink-900 dark:text-white">Store Keeper Growth</h3>
            <p className="text-xs text-ink-700/50 dark:text-white/40">Accounts added over the last 6 months</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={growthTrend}>
              <defs>
                <linearGradient id="colorAdded" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ea580c" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#8887a0" }} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#8887a0" }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)", fontSize: 13 }} />
              <Area type="monotone" dataKey="added" name="Store Keepers Added" stroke="#ea580c" fill="url(#colorAdded)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
          <h3 className="font-display font-semibold text-ink-900 dark:text-white">Account Status</h3>
          <p className="mb-2 text-xs text-ink-700/50 dark:text-white/40">Where your team stands right now</p>
          {statusDistribution.length === 0 ? (
            <div className="flex h-56 items-center justify-center text-sm text-ink-700/40 dark:text-white/30">No storekeepers yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={statusDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {statusDistribution.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)", fontSize: 13 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold text-ink-900 dark:text-white">Recently Added</h3>
              <p className="text-xs text-ink-700/50 dark:text-white/40">Your newest store keeper accounts</p>
            </div>
            <Link to="/storekeepers" className="flex shrink-0 items-center gap-1 text-xs font-semibold text-brand-600 hover:underline dark:text-brand-400">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {recentStorekeepers.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-center text-sm text-ink-700/40 dark:text-white/30">
              <Users size={28} className="text-brand-300" />
              No store keepers yet
              <Link to="/storekeepers" className="btn-primary mt-1 !py-2 !px-3 text-xs">
                <UserPlus size={14} /> Add one
              </Link>
            </div>
          ) : (
            <div className="max-h-56 space-y-2.5 overflow-y-auto pr-1">
              {recentStorekeepers.map((sk) => (
                <div key={sk.id} className="flex items-center gap-3 rounded-xl border border-black/5 p-2.5 dark:border-white/10">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-red-500 text-xs font-bold text-white">
                    {sk.fullnames.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-900 dark:text-white">{sk.fullnames}</p>
                    <p className="truncate text-xs text-ink-700/50 dark:text-white/40">{sk.email}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {sk.isActive ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge badge-danger">Deactivated</span>
                    )}
                    {sk.mustChangePassword && <span className="badge badge-warning">Pending setup</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
          <h3 className="font-display font-semibold text-ink-900 dark:text-white">Recent Activity</h3>
          <p className="mb-3 text-xs text-ink-700/50 dark:text-white/40">Your own administration actions</p>
          {recentActivity.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-ink-700/40 dark:text-white/30">No activity yet</div>
          ) : (
            <div className="max-h-56 space-y-3 overflow-y-auto pr-1">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex gap-2.5 text-sm">
                  <div className="mt-0.5 shrink-0 rounded-lg bg-slate-50 p-1.5 dark:bg-white/5">{actionIcon(a.action)}</div>
                  <div className="min-w-0">
                    <p className="truncate text-ink-800 dark:text-white/70">{a.details || a.action}</p>
                    <p className="text-xs text-ink-700/40 dark:text-white/30">{timeAgo(a.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
