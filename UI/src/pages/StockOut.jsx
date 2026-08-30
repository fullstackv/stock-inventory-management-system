import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import { toast } from "sonner";
import { PlusCircle, ArrowUpFromLine } from "lucide-react";
import { formatFRW } from "../utils/currency";

const StockOut = () => {
  const [stockOut, setStockOut] = useState([]);
  const [spares, setSpares] = useState([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    spare_id: "",
    stockOutQuantity: "",
    stockOutDate: ""
  });
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchData = async () => {
    try {
      const stockRes = await api.get("/stockout");
      const spareRes = await api.get("/spares/all");
      setStockOut(stockRes.data);
      setSpares(spareRes.data);
    } catch (error) {
      console.error("Fetch stock-out error:", error);
      toast.error(error.response?.data?.error || "Failed to load stock-out records");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      setForm({ spare_id: "", stockOutQuantity: "", stockOutDate: "" });
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
      <div>
        <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white sm:text-2xl">Stock Out</h2>
        <p className="text-sm text-ink-700/50 dark:text-white/40">Record inventory leaving the warehouse</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card h-fit p-6">
          <h3 className="mb-4 flex items-center gap-2 font-display font-semibold text-ink-900 dark:text-white">
            <div className="rounded-lg bg-gradient-to-br from-rose-500 to-red-500 p-1.5 text-white">
              <ArrowUpFromLine size={16} />
            </div>
            Remove Stock
          </h3>

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

            <button type="submit" className="btn-danger w-full" disabled={saving}>
              <PlusCircle size={18} />
              {saving ? "Removing..." : "Remove Stock"}
            </button>
          </form>
        </div>

        <div className="card overflow-hidden lg:col-span-2">
          <div className="border-b border-black/5 p-6 pb-4 dark:border-white/10">
            <h3 className="font-display font-semibold text-ink-900 dark:text-white">Stock Out Records</h3>
            <p className="text-xs text-ink-700/50 dark:text-white/40">{stockOut.length} record(s)</p>
          </div>
          <div className="max-h-[520px] overflow-auto">
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
                {stockOut.length > 0 ? (
                  stockOut.map((item, index) => (
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-sm text-ink-700/40 dark:text-white/30">
                      No stock out records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockOut;
