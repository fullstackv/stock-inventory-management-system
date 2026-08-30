import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Truck, Pencil, Trash2, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import api from "../api/axios";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";

const emptyForm = { name: "", contact_person: "", email: "", phone: "", address: "" };

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/suppliers");
      setSuppliers(res.data);
    } catch (error) {
      console.error("Fetch suppliers error:", error);
      toast.error("Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (sup) => {
    setEditing(sup);
    setForm({
      name: sup.name,
      contact_person: sup.contact_person || "",
      email: sup.email || "",
      phone: sup.phone || "",
      address: sup.address || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/suppliers/${editing._id}`, form);
        toast.success("Supplier updated successfully!");
      } else {
        await api.post("/suppliers", form);
        toast.success("Supplier added successfully!");
      }
      setModalOpen(false);
      fetchSuppliers();
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await api.delete(`/suppliers/${deleteTarget._id}`);
      toast.success("Supplier deleted successfully!");
      setDeleteTarget(null);
      fetchSuppliers();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete supplier");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white sm:text-2xl">Suppliers</h2>
          <p className="text-sm text-ink-700/50 dark:text-white/40">Manage the vendors you source spares from</p>
        </div>
        <button onClick={openCreate} className="btn-primary self-start">
          <Plus size={18} /> New Supplier
        </button>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-14" />
            ))}
          </div>
        ) : suppliers.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
            <Truck size={40} className="text-brand-300" />
            <p className="font-display font-semibold text-ink-900 dark:text-white">No suppliers yet</p>
            <p className="text-sm text-ink-700/50 dark:text-white/40">Add your first supplier to link them to spares.</p>
            <button onClick={openCreate} className="btn-primary mt-2">
              <Plus size={16} /> New Supplier
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th>Contact</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th className="text-center">Spares</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10">
                {suppliers.map((sup, i) => (
                  <motion.tr
                    key={sup._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="table-row-hover"
                  >
                    <td className="font-medium text-ink-900 dark:text-white">{sup.name}</td>
                    <td>
                      <div className="text-sm text-ink-700/70 dark:text-white/50">{sup.contact_person || "-"}</div>
                      {sup.email && (
                        <div className="flex items-center gap-1 text-xs text-ink-700/40 dark:text-white/30">
                          <Mail size={11} /> {sup.email}
                        </div>
                      )}
                    </td>
                    <td className="text-sm text-ink-700/70 dark:text-white/50">
                      {sup.phone ? (
                        <span className="flex items-center gap-1"><Phone size={12} /> {sup.phone}</span>
                      ) : "-"}
                    </td>
                    <td className="max-w-[180px] truncate text-sm text-ink-700/70 dark:text-white/50">
                      {sup.address ? (
                        <span className="flex items-center gap-1"><MapPin size={12} className="shrink-0" /> {sup.address}</span>
                      ) : "-"}
                    </td>
                    <td className="text-center">
                      <span className="badge badge-info">{sup.spareCount}</span>
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(sup)} className="rounded-lg p-1.5 text-ink-700/50 hover:bg-brand-50 hover:text-brand-600 dark:text-white/40 dark:hover:bg-white/10">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(sup)} className="rounded-lg p-1.5 text-ink-700/50 hover:bg-rose-50 hover:text-rose-600 dark:text-white/40 dark:hover:bg-white/10">
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
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Supplier" : "New Supplier"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-white/70">Supplier Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Acme Parts Ltd"
              className="input-field"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-white/70">Contact Person</label>
              <input
                type="text"
                value={form.contact_person}
                onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-white/70">Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-white/70">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-white/70">Address</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows={2}
              className="input-field resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={saving}>
              {saving ? "Saving..." : editing ? "Update Supplier" : "Add Supplier"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={saving}
        title="Delete this supplier?"
        message={`"${deleteTarget?.name}" will be removed. Linked spares will keep their data but lose this supplier reference.`}
      />
    </div>
  );
};

export default Suppliers;
