import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import { toast } from "sonner";
import { PlusCircle, ArrowDownToLine } from "lucide-react";

const StockIn = () => {
  const [stockIn, setStockIn] = useState([]);
  const [spares, setSpares] = useState([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    spare_id: "",
    stockInQuantity: "",
    stockInDate: ""
  });

  const fetchData = async () => {
    try {
      const stockRes = await api.get("/stockin");
      const spareRes = await api.get("/spares/all");
      setStockIn(stockRes.data);
      setSpares(spareRes.data);
    } catch (error) {
      console.error("Fetch stock-in error:", error);
      toast.error(error.response?.data?.error || "Failed to load stock-in records");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post("/stockin", form);
      toast.success(res.data.message);
      setForm({ spare_id: "", stockInQuantity: "", stockInDate: "" });
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
      <div>
        <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white sm:text-2xl">Stock In</h2>
        <p className="text-sm text-ink-700/50 dark:text-white/40">Record incoming inventory from suppliers</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card h-fit p-6">
          <h3 className="mb-4 flex items-center gap-2 font-display font-semibold text-ink-900 dark:text-white">
            <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 p-1.5 text-white">
              <ArrowDownToLine size={16} />
            </div>
            Add Stock
          </h3>

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

            <button type="submit" className="btn-primary w-full" disabled={saving}>
              <PlusCircle size={18} />
              {saving ? "Adding..." : "Add Stock"}
            </button>
          </form>
        </div>

        <div className="card overflow-hidden lg:col-span-2">
          <div className="border-b border-black/5 p-6 pb-4 dark:border-white/10">
            <h3 className="font-display font-semibold text-ink-900 dark:text-white">Stock In Records</h3>
            <p className="text-xs text-ink-700/50 dark:text-white/40">{stockIn.length} record(s)</p>
          </div>
          <div className="max-h-[520px] overflow-auto">
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
                {stockIn.length > 0 ? (
                  stockIn.map((item, index) => (
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-10 text-center text-sm text-ink-700/40 dark:text-white/30">
                      No stock records found
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

export default StockIn;
