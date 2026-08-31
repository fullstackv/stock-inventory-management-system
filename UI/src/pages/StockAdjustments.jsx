import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, ArrowUp, ArrowDown, Plus } from "lucide-react";
import toast from "react-hot-toast"
import api from "../api/axios";
import Modal from "../components/ui/Modal";

const reasonPresets = ["Damaged", "Stock-take correction", "Expired", "Theft/Loss", "Return to supplier", "Other"];

const StockAdjustments = () => {
  const [adjustments, setAdjustments] = useState([]);
  const [spares, setSpares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ spare_id: "", adjustment_type: "decrease", quantity: "", reason: reasonPresets[0] });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [adjRes, spareRes] = await Promise.all([api.get("/adjustments"), api.get("/spares/all")]);
      setAdjustments(adjRes.data);
      setSpares(spareRes.data);
    } catch (error) {
      console.error("Fetch adjustments error:", error);
      toast.error("Failed to load adjustments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/adjustments", form);
      toast.success("Stock adjustment recorded!");
      setModalOpen(false);
      setForm({ spare_id: "", adjustment_type: "decrease", quantity: "", reason: reasonPresets[0] });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to record adjustment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white sm:text-2xl">Stock Adjustments</h2>
          <p className="text-sm text-ink-700/50 dark:text-white/40">Correct stock levels outside the normal in/out flow</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary self-start">
          <Plus size={18} /> New Adjustment
        </button>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-6">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-12" />)}
          </div>
        ) : adjustments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
            <SlidersHorizontal size={40} className="text-brand-300" />
            <p className="font-display font-semibold text-ink-900 dark:text-white">No adjustments recorded</p>
            <p className="text-sm text-ink-700/50 dark:text-white/40">Log damages, corrections, or stock-take differences here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Item</th>
                  <th>Type</th>
                  <th className="text-center">Qty</th>
                  <th>Reason</th>
                  <th>By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10">
                {adjustments.map((a, i) => (
                  <motion.tr
                    key={a.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.02, 0.4) }}
                    className="table-row-hover"
                  >
                    <td className="text-sm text-ink-700/70 dark:text-white/50">{new Date(a.created_at).toLocaleString()}</td>
                    <td>
                      <p className="font-medium text-ink-900 dark:text-white">{a.spareName}</p>
                      <p className="font-mono text-xs text-ink-700/40 dark:text-white/30">{a.sku}</p>
                    </td>
                    <td>
                      {a.adjustment_type === "increase" ? (
                        <span className="badge badge-success"><ArrowUp size={11} /> Increase</span>
                      ) : (
                        <span className="badge badge-danger"><ArrowDown size={11} /> Decrease</span>
                      )}
                    </td>
                    <td className="text-center font-semibold text-ink-900 dark:text-white">{a.quantity}</td>
                    <td className="text-sm text-ink-700/70 dark:text-white/50">{a.reason}</td>
                    <td className="text-sm text-ink-700/70 dark:text-white/50">{a.adjusted_by}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Stock Adjustment">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-white/70">Spare</label>
            <select
              value={form.spare_id}
              onChange={(e) => setForm({ ...form, spare_id: e.target.value })}
              className="select-field"
              required
            >
              <option value="">Select a spare...</option>
              {spares.map((s) => (
                <option key={s._id} value={s._id}>{s.name} (in stock: {s.quantity})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-white/70">Adjustment Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, adjustment_type: "increase" })}
                className={`flex items-center justify-center gap-2 rounded-xl border-2 py-2.5 text-sm font-medium transition-all ${
                  form.adjustment_type === "increase"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "border-black/10 text-ink-700/60 hover:border-emerald-200 dark:border-white/10 dark:text-white/50"
                }`}
              >
                <ArrowUp size={16} /> Increase
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, adjustment_type: "decrease" })}
                className={`flex items-center justify-center gap-2 rounded-xl border-2 py-2.5 text-sm font-medium transition-all ${
                  form.adjustment_type === "decrease"
                    ? "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                    : "border-black/10 text-ink-700/60 hover:border-rose-200 dark:border-white/10 dark:text-white/50"
                }`}
              >
                <ArrowDown size={16} /> Decrease
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-white/70">Quantity</label>
            <input
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-white/70">Reason</label>
            <select
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="select-field"
            >
              {reasonPresets.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={saving}>
              {saving ? "Saving..." : "Record Adjustment"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StockAdjustments;
