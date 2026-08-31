import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import toast from "react-hot-toast"
import { Plus, ArrowUpFromLine } from "lucide-react";
import Modal from "../components/ui/Modal";
import { formatFRW } from "../utils/currency";

const emptyForm = { spare_id: "", stockOutQuantity: "", stockOutDate: "" };

const StockOut = () => {
  const [stockOut, setStockOut] = useState([]);
  const [spares, setSpares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const stockRes = await api.get("/stockout");
      const spareRes = await api.get("/spares/all");
      setStockOut(stockRes.data);
      setSpares(spareRes.data);
    } catch (error) {
      console.error("Fetch stock-out error:", error);
      toast.error(error.response?.data?.error || "Failed to load stock-out records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setTotalPrice(0);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);

    if (updated.spare_id && updated.stockOutQuantity) {
      const spare = spares.find((s) => s._id === updated.spare_id);
      if (spare) {
        setTotalPrice(spare.unitPrice * updated.stockOutQuantity);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post("/stockout", form);
      toast.success(res.data.message);
      setModalOpen(false);
      setTotalPrice(0);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to remove stock");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  const selectedSpare = spares.find((s) => s._id === form.spare_id);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white sm:text-2xl">Stock Out</h2>
          <p className="text-sm text-ink-700/50 dark:text-white/40">Record inventory leaving the warehouse</p>
        </div>
        <button onClick={openCreate} className="btn-danger self-start">
          <Plus size={18} /> Remove Stock
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-black/5 p-6 pb-4 dark:border-white/10">
          <h3 className="font-display font-semibold text-ink-900 dark:text-white">Stock Out Records</h3>
          <p className="text-xs text-ink-700/50 dark:text-white/40">{stockOut.length} record(s)</p>
        </div>

        {loading ? (
          <div className="space-y-3 p-6">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-14" />)}
          </div>
        ) : stockOut.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
            <ArrowUpFromLine size={40} className="text-brand-300" />
            <p className="font-display font-semibold text-ink-900 dark:text-white">No stock-out records yet</p>
            <p className="text-sm text-ink-700/50 dark:text-white/40">Record inventory as it leaves the warehouse.</p>
            <button onClick={openCreate} className="btn-danger mt-2">
              <Plus size={16} /> Remove Stock
            </button>
          </div>
        ) : (
          <div className="max-h-[560px] overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0">
                <tr>
                  <th>#</th>
                  <th>Spare</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-right">Total Price</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10">
                {stockOut.map((item, index) => (
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
                      <span className="badge badge-danger">-{item.stockOutQuantity}</span>
                    </td>
                    <td className="text-right font-semibold text-ink-900 dark:text-white">{formatFRW(item.stockOutTotalPrice)}</td>
                    <td className="text-sm text-ink-700/70 dark:text-white/50">{formatDate(item.stockOutDate)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Remove Stock">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-white/70">Spare</label>
            <select name="spare_id" value={form.spare_id} onChange={handleChange} className="select-field" required>
              <option value="">Select Spare</option>
              {spares.map((s) => (
                <option key={s._id} value={s._id}>{s.name} (in stock: {s.quantity})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-white/70">Quantity</label>
            <input
              type="number" min="1" max={selectedSpare?.quantity}
              name="stockOutQuantity" value={form.stockOutQuantity}
              placeholder="e.g. 10" onChange={handleChange} className="input-field" required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-white/70">Date</label>
            <input type="date" name="stockOutDate" value={form.stockOutDate} onChange={handleChange} className="input-field" required />
          </div>

          <div className="flex items-center justify-between rounded-xl bg-rose-50 p-3.5 text-sm ring-1 ring-rose-100 dark:bg-rose-500/10 dark:ring-rose-500/20">
            <span className="text-ink-700/60 dark:text-white/50">Total Value Out:</span>
            <span className="font-display font-bold text-rose-600 dark:text-rose-400">{formatFRW(totalPrice)}</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-danger flex-1" disabled={saving}>
              {saving ? "Removing..." : "Remove Stock"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StockOut;
