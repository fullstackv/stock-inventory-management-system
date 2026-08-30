import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Tags, Pencil, Trash2, Package } from "lucide-react";
import { toast } from "sonner";
import api from "../api/axios";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";

const emptyForm = { name: "", description: "" };

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Fetch categories error:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description || "" });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/categories/${editing._id}`, form);
        toast.success("Category updated successfully!");
      } else {
        await api.post("/categories", form);
        toast.success("Category created successfully!");
      }
      setModalOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await api.delete(`/categories/${deleteTarget._id}`);
      toast.success("Category deleted successfully!");
      setDeleteTarget(null);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white sm:text-2xl">Categories</h2>
          <p className="text-sm text-ink-700/50 dark:text-white/40">Organize your spares into logical groups</p>
        </div>
        <button onClick={openCreate} className="btn-primary self-start">
          <Plus size={18} /> New Category
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-32" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="card flex flex-col items-center justify-center gap-3 p-16 text-center">
          <Tags size={40} className="text-brand-300" />
          <p className="font-display font-semibold text-ink-900 dark:text-white">No categories yet</p>
          <p className="text-sm text-ink-700/50 dark:text-white/40">Create your first category to start organizing spares.</p>
          <button onClick={openCreate} className="btn-primary mt-2">
            <Plus size={16} /> New Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card group p-5"
            >
              <div className="flex items-start justify-between">
                <div className="rounded-xl bg-gradient-to-br from-brand-500 to-red-500 p-2.5 shadow-glow">
                  <Tags size={18} className="text-white" />
                </div>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => openEdit(cat)} className="rounded-lg p-1.5 text-ink-700/50 hover:bg-brand-50 hover:text-brand-600 dark:text-white/40 dark:hover:bg-white/10">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => setDeleteTarget(cat)} className="rounded-lg p-1.5 text-ink-700/50 hover:bg-rose-50 hover:text-rose-600 dark:text-white/40 dark:hover:bg-white/10">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <h3 className="mt-3 font-display font-semibold text-ink-900 dark:text-white">{cat.name}</h3>
              <p className="mt-0.5 line-clamp-2 text-sm text-ink-700/50 dark:text-white/40">{cat.description || "No description"}</p>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-ink-700/50 dark:text-white/40">
                <Package size={13} />
                <span>{cat.spareCount} spare(s) · {cat.totalQuantity} units</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Category" : "New Category"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-white/70">Category Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Electrical Components"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-white/70">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optional description..."
              rows={3}
              className="input-field resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={saving}>
              {saving ? "Saving..." : editing ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={saving}
        title="Delete this category?"
        message={`"${deleteTarget?.name}" will be removed. Spares in this category will become uncategorized.`}
      />
    </div>
  );
};

export default Categories;
