import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Search, Pencil, Trash2, Package, ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import toast from "react-hot-toast"
import api from "../api/axios";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { formatFRW } from "../utils/currency";

const emptyForm = {
  name: "", sku: "", category_id: "", supplier_id: "",
  quantity: "", unitPrice: "", minStockLevel: "10", location: ""
};

const Spares = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [spares, setSpares] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(searchParams.get("lowStockOnly") === "true");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchLookups = async () => {
    try {
      const [catRes, supRes] = await Promise.all([api.get("/categories"), api.get("/suppliers")]);
      setCategories(catRes.data);
      setSuppliers(supRes.data);
    } catch (error) {
      console.error("Fetch lookups error:", error);
    }
  };

  const fetchSpares = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/spares", {
        params: {
          search: search || undefined,
          category_id: categoryFilter || undefined,
          supplier_id: supplierFilter || undefined,
          lowStockOnly: lowStockOnly ? "true" : undefined,
          page,
          limit: 8,
        },
      });
      setSpares(res.data.data);
      setPagination({ page: res.data.page, totalPages: res.data.totalPages, total: res.data.total });
    } catch (error) {
      console.error("Fetch spares error:", error);
      toast.error("Failed to load spares");
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, supplierFilter, lowStockOnly, page]);

  useEffect(() => { fetchLookups(); }, []);
  useEffect(() => { fetchSpares(); }, [fetchSpares]);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (lowStockOnly) params.lowStockOnly = "true";
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, lowStockOnly]);

  const resetFilters = () => {
    setSearch(""); setCategoryFilter(""); setSupplierFilter(""); setLowStockOnly(false); setPage(1);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (spare) => {
    setEditing(spare);
    setForm({
      name: spare.name,
      sku: spare.sku || "",
      category_id: spare.category?._id || "",
      supplier_id: spare.supplier?._id || "",
      quantity: spare.quantity,
      unitPrice: spare.unitPrice,
      minStockLevel: spare.minStockLevel,
      location: spare.location || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/spares/${editing._id}`, form);
        toast.success("Spare updated successfully!");
      } else {
        await api.post("/spares", form);
        toast.success("New spare added to inventory!");
      }
      setModalOpen(false);
      fetchSpares();
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await api.delete(`/spares/${deleteTarget._id}`);
      toast.success("Spare deleted successfully!");
      setDeleteTarget(null);
      fetchSpares();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete spare");
    } finally {
      setSaving(false);
    }
  };

  const stockBadge = (spare) => {
    if (spare.quantity <= 0) return <span className="badge badge-danger">Out of stock</span>;
    if (spare.quantity <= spare.minStockLevel) return <span className="badge badge-warning">Low stock</span>;
    return <span className="badge badge-success">In stock</span>;
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white sm:text-2xl">Spares Inventory</h2>
          <p className="text-sm text-ink-700/50 dark:text-white/40">{pagination.total} item(s) across your warehouse</p>
        </div>
        <button onClick={openCreate} className="btn-primary self-start">
          <Plus size={18} /> New Spare
        </button>
      </div>

      {/* Filters */}
      <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-700/40 dark:text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or SKU..."
            className="input-field pl-9"
          />
        </div>
        <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className="select-field sm:w-44">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <select value={supplierFilter} onChange={(e) => { setSupplierFilter(e.target.value); setPage(1); }} className="select-field sm:w-44">
          <option value="">All Suppliers</option>
          {suppliers.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
        <button
          onClick={() => { setLowStockOnly(!lowStockOnly); setPage(1); }}
          className={`flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all ${
            lowStockOnly ? "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" : "border-black/10 text-ink-700/60 hover:border-amber-200 dark:border-white/10 dark:text-white/50"
          }`}
        >
          <Filter size={14} /> Low stock only
        </button>
        {(search || categoryFilter || supplierFilter || lowStockOnly) && (
          <button onClick={resetFilters} className="flex items-center gap-1 text-sm text-ink-700/50 hover:text-rose-600 dark:text-white/40">
            <X size={14} /> Clear
          </button>
        )}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-6">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-14" />)}
          </div>
        ) : spares.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
            <Package size={40} className="text-brand-300" />
            <p className="font-display font-semibold text-ink-900 dark:text-white">No spares found</p>
            <p className="text-sm text-ink-700/50 dark:text-white/40">Try adjusting your filters, or add a new spare.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Supplier</th>
                  <th className="text-center">Qty</th>
                  <th className="text-right">Unit Price</th>
                  <th className="text-right">Total Value</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10">
                {spares.map((spare, i) => (
                  <motion.tr
                    key={spare._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="table-row-hover"
                  >
                    <td>
                      <p className="font-medium text-ink-900 dark:text-white">{spare.name}</p>
                      <p className="font-mono text-xs text-ink-700/40 dark:text-white/30">{spare.sku || "—"}</p>
                    </td>
                    <td className="text-sm text-ink-700/70 dark:text-white/50">{spare.category?.name || <span className="text-ink-700/30 dark:text-white/20">Uncategorized</span>}</td>
                    <td className="text-sm text-ink-700/70 dark:text-white/50">{spare.supplier?.name || <span className="text-ink-700/30 dark:text-white/20">-</span>}</td>
                    <td className="text-center font-semibold text-ink-900 dark:text-white">{spare.quantity}</td>
                    <td className="text-right text-sm text-ink-700/70 dark:text-white/50">{formatFRW(spare.unitPrice)}</td>
                    <td className="text-right font-medium text-ink-900 dark:text-white">{formatFRW(spare.totalPrice)}</td>
                    <td>{stockBadge(spare)}</td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(spare)} className="rounded-lg p-1.5 text-ink-700/50 hover:bg-brand-50 hover:text-brand-600 dark:text-white/40 dark:hover:bg-white/10">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(spare)} className="rounded-lg p-1.5 text-ink-700/50 hover:bg-rose-50 hover:text-rose-600 dark:text-white/40 dark:hover:bg-white/10">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && spares.length > 0 && (
          <div className="flex items-center justify-between border-t border-black/5 px-5 py-3 dark:border-white/10">
            <p className="text-xs text-ink-700/50 dark:text-white/40">
              Page {pagination.page} of {pagination.totalPages} · {pagination.total} total
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pagination.page <= 1}
                className="rounded-lg border border-black/10 p-1.5 text-ink-700 disabled:opacity-30 dark:border-white/10 dark:text-white/60"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={pagination.page >= pagination.totalPages}
                className="rounded-lg border border-black/10 p-1.5 text-ink-700 disabled:opacity-30 dark:border-white/10 dark:text-white/60"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Spare" : "New Spare"} size="lg">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-white/70">Item Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-white/70">SKU <span className="text-ink-700/40 dark:text-white/30">(auto if blank)</span></label>
            <input
              type="text"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              className="input-field font-mono"
              placeholder="SP-00001"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-white/70">Storage Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="input-field"
              placeholder="e.g. Aisle 3, Shelf B"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-white/70">Category</label>
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="select-field">
              <option value="">Uncategorized</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-white/70">Supplier</label>
            <select value={form.supplier_id} onChange={(e) => setForm({ ...form, supplier_id: e.target.value })} className="select-field">
              <option value="">None</option>
              {suppliers.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-white/70">Quantity</label>
            <input
              type="number" min="0"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-white/70">Unit Price (FRW)</label>
            <input
              type="number" min="0" step="1"
              value={form.unitPrice}
              onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-white/70">Reorder Level (min stock before alert)</label>
            <input
              type="number" min="0"
              value={form.minStockLevel}
              onChange={(e) => setForm({ ...form, minStockLevel: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="flex gap-3 pt-2 sm:col-span-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={saving}>
              {saving ? "Saving..." : editing ? "Update Spare" : "Add Spare"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={saving}
        title="Delete this spare?"
        message={`"${deleteTarget?.name}" and its full history reference will be permanently removed.`}
      />
    </div>
  );
};

export default Spares;
