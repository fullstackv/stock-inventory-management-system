import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import toast from "react-hot-toast"
import { Plus, ArrowDownToLine } from "lucide-react";
import Modal from "../components/ui/Modal";

const emptyForm = { spare_id: "", stockInQuantity: "", stockInDate: "" };

const StockIn = () => {
  const [stockIn, setStockIn] = useState([]);
  const [spares, setSpares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchData = async () => {
    setLoading(true);
    try {
      const stockRes = await api.get("/stockin");
      const spareRes = await api.get("/spares/all");
      setStockIn(stockRes.data);
      setSpares(spareRes.data);
    } catch (error) {
      console.error("Fetch stock-in error:", error);
      toast.error(error.response?.data?.error || "Failed to load stock-in records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post("/stockin", form);
      toast.success(res.data.message);
      setModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add stock");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white sm:text-2xl">Stock In</h2>
          <p className="text-sm text-ink-700/50 dark:text-white/40">Record incoming inventory from suppliers</p>
        </div>
        <button onClick={openCreate} className="btn-primary self-start">
          <Plus size={18} /> Add Stock
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-black/5 p-6 pb-4 dark:border-white/10">
          <h3 className="font-display font-semibold text-ink-900 dark:text-white">Stock In Records</h3>
          <p className="text-xs text-ink-700/50 dark:text-white/40">{stockIn.length} record(s)</p>
        </div>

        {loading ? (
          <div className="space-y-3 p-6">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-14" />)}
          </div>
        ) : stockIn.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
            <ArrowDownToLine size={40} className="text-brand-300" />
            <p className="font-display font-semibold text-ink-900 dark:text-white">No stock-in records yet</p>
            <p className="text-sm text-ink-700/50 dark:text-white/40">Record your first delivery from a supplier.</p>
            <button onClick={openCreate} className="btn-primary mt-2">
              <Plus size={16} /> Add Stock
            </button>
          </div>
        ) : (
          <div className="max-h-[560px] overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0">
                <tr>
                  <th>#</th>
                  <th>Spare Name</th>
                  <th className="text-center">Quantity</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10">
                {stockIn.map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(index * 0.02, 0.4) }}
                    className="table-row-hover"
                  >
                    <td className="text-sm text-ink-700/50 dark:text-white/40">{index + 1}</td>
                    <td className="font-medium text-ink-900 dark:text-white">{item.name}</td>
                    <td className="text-center">
                      <span className="badge badge-success">+{item.stockInQuantity}</span>
                    </td>
                    <td className="text-sm text-ink-700/70 dark:text-white/50">{formatDate(item.stockInDate)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Stock">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-white/70">Spare</label>
            <select name="spare_id" value={form.spare_id} onChange={handleChange} className="select-field" required>
              <option value="">Select Spare</option>
              {spares.map((s) => (
                <option key={s._id} value={s._id}>{s.name} (current: {s.quantity})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-white/70">Quantity</label>
            <input
              type="number" min="1" name="stockInQuantity" value={form.stockInQuantity}
              placeholder="e.g. 50" onChange={handleChange} className="input-field" required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-white/70">Date</label>
            <input type="date" name="stockInDate" value={form.stockInDate} onChange={handleChange} className="input-field" required />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={saving}>
              {saving ? "Adding..." : "Add Stock"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StockIn;
