import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import {
  Package, DollarSign, AlertTriangle, Truck,
  TrendingUp, TrendingDown, Activity, ArrowDownToLine, ArrowUpFromLine, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import api from "../api/axios";
import StatCard from "../components/ui/StatCard";
import { formatFRW } from "../utils/currency";

const PIE_COLORS = ["#ea580c", "#f97316", "#fb923c", "#dc2626", "#f59e0b", "#fdba74", "#c2410c"];

const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const actionIcon = (action) => {
  if (action.includes("STOCK_IN")) return <ArrowDownToLine size={14} className="text-emerald-600 dark:text-emerald-400" />;
  if (action.includes("STOCK_OUT")) return <ArrowUpFromLine size={14} className="text-rose-600 dark:text-rose-400" />;
  if (action.includes("DELETE")) return <AlertTriangle size={14} className="text-rose-600 dark:text-rose-400" />;
  return <Activity size={14} className="text-brand-600 dark:text-brand-400" />;
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.get("/analytics");
      setData(res.data);
    } catch (error) {
      console.error("Fetch analytics error:", error);
      const message = error.response?.data?.error || error.message || "Failed to load dashboard analytics";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
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

  // Show a real, actionable error instead of crashing on a null destructure
  // when the analytics request fails (auth issue, backend error, network, etc).
  if (errorMessage || !data) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center gap-3 rounded-2xl border border-black/5 bg-white p-16 text-center dark:border-white/10 dark:bg-ink-800">
        <AlertTriangle size={36} className="text-rose-400" />
        <p className="font-display font-semibold text-ink-900 dark:text-white">Couldn't load the dashboard</p>
        <p className="max-w-md text-sm text-ink-700/50 dark:text-white/40">{errorMessage || "No data was returned."}</p>
        <button onClick={fetchAnalytics} className="btn-primary mt-2">
          <RefreshCw size={15} /> Try again
        </button>
      </div>
    );
  }

  const { summary, monthlyTrend, topMovingItems, categoryDistribution, lowStockItems, recentActivity } = data;
  const netFlow = (summary.stockInThisMonth || 0) - (summary.stockOutThisMonth || 0);

  return (
    <div className="animate-fade-in space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Package} label="Total Spares" value={summary.totalSpares} tone="brand" />
        <StatCard icon={DollarSign} label="Stock Value" value={summary.totalStockValue} prefix="FRW " tone="success" />
        <StatCard icon={AlertTriangle} label="Low Stock Alerts" value={summary.lowStockCount} tone="warning" />
        <StatCard icon={Truck} label="Suppliers" value={summary.totalSuppliers} tone="info" subtitle={`${summary.totalCategories} categories`} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold text-ink-900 dark:text-white">Stock Movement Trend</h3>
              <p className="text-xs text-ink-700/50 dark:text-white/40">Last 6 months · In vs Out</p>
            </div>
            <div className={`badge ${netFlow >= 0 ? "badge-success" : "badge-danger"}`}>
              {netFlow >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {netFlow >= 0 ? "+" : ""}{netFlow} this month
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ea580c" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#8887a0" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#8887a0" }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)", fontSize: 13 }} />
              <Area type="monotone" dataKey="stockIn" name="Stock In" stroke="#ea580c" fill="url(#colorIn)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="stockOut" name="Stock Out" stroke="#64748b" fill="url(#colorOut)" strokeWidth={2.5} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
          <h3 className="font-display font-semibold text-ink-900 dark:text-white">Stock Value by Category</h3>
          <p className="mb-2 text-xs text-ink-700/50 dark:text-white/40">Where your capital is tied up</p>
          {categoryDistribution.length === 0 ? (
            <div className="flex h-56 items-center justify-center text-sm text-ink-700/40 dark:text-white/30">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatFRW(value)}
                  contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)", fontSize: 13 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-5">
          <h3 className="font-display font-semibold text-ink-900 dark:text-white">Top Moving Items</h3>
          <p className="mb-3 text-xs text-ink-700/50 dark:text-white/40">By total units shipped out</p>
          {topMovingItems.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-ink-700/40 dark:text-white/30">No stock-out activity yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topMovingItems} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8887a0" }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={90} tick={{ fontSize: 11, fill: "#333" }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)", fontSize: 13 }} />
                <Bar dataKey="totalOut" fill="#ea580c" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
          <h3 className="font-display font-semibold text-ink-900 dark:text-white">Reorder Watchlist</h3>
          <p className="mb-3 text-xs text-ink-700/50 dark:text-white/40">Items at or below their minimum level</p>
          {lowStockItems.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center text-center text-sm text-ink-700/40 dark:text-white/30">
              <span className="text-2xl">🎉</span> All stock levels are healthy
            </div>
          ) : (
            <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
              {lowStockItems.map((item) => {
                const pct = Math.min(100, (item.quantity / Math.max(item.min_stock_level, 1)) * 100);
                return (
                  <div key={item.id} className="rounded-lg border border-black/5 p-2.5 dark:border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="truncate font-medium text-ink-900 dark:text-white">{item.name}</span>
                      <span className="shrink-0 text-xs text-ink-700/50 dark:text-white/40">{item.quantity}/{item.min_stock_level}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                      <div
                        className={`h-full rounded-full ${pct <= 30 ? "bg-rose-500" : "bg-amber-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card p-5">
          <h3 className="font-display font-semibold text-ink-900 dark:text-white">Recent Activity</h3>
          <p className="mb-3 text-xs text-ink-700/50 dark:text-white/40">Your own activity trail</p>
          {recentActivity.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-ink-700/40 dark:text-white/30">No activity yet</div>
          ) : (
            <div className="max-h-56 space-y-3 overflow-y-auto pr-1">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex gap-2.5 text-sm">
                  <div className="mt-0.5 shrink-0 rounded-lg bg-slate-50 p-1.5 dark:bg-white/5">{actionIcon(a.action)}</div>
                  <div className="min-w-0">
                    <p className="truncate text-ink-800 dark:text-white/70">{a.details || a.action}</p>
                    <p className="text-xs text-ink-700/40 dark:text-white/30">{a.user_email} · {timeAgo(a.created_at)}</p>
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

export default Dashboard;