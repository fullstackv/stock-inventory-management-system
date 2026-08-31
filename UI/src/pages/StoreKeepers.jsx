import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Users, Pencil, Trash2, Power, KeyRound, Copy, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast"
import api from "../api/axios";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";

const emptyForm = { fullnames: "", email: "", phone: "" };

const StoreKeepers = () => {
  const [storekeepers, setStorekeepers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);
  const [credentialModal, setCredentialModal] = useState(null); // { fullnames, email, tempPassword }
  const [copied, setCopied] = useState(false);

  const fetchStorekeepers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/storekeepers");
      setStorekeepers(res.data);
    } catch (error) {
      console.error("Fetch storekeepers error:", error);
      toast.error("Failed to load storekeepers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStorekeepers();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (sk) => {
    setEditing(sk);
    setForm({ fullnames: sk.fullnames, email: sk.email, phone: sk.phone || "" });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/storekeepers/${editing._id}`, form);
        toast.success("Storekeeper updated successfully!");
        setModalOpen(false);
        fetchStorekeepers();
      } else {
        const res = await api.post("/storekeepers", form);
        toast.success("Storekeeper created successfully!");
        setModalOpen(false);
        setCredentialModal({
          fullnames: form.fullnames,
          email: form.email,
          tempPassword: res.data.tempPassword,
        });
        fetchStorekeepers();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    setSaving(true);
    try {
      const nextActive = !statusTarget.isActive;
      await api.patch(`/storekeepers/${statusTarget._id}/status`, { isActive: nextActive });
      toast.success(`Storekeeper ${nextActive ? "activated" : "deactivated"} successfully!`);
      setStatusTarget(null);
      fetchStorekeepers();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async (sk) => {
    try {
      const res = await api.post(`/storekeepers/${sk._id}/reset-password`);
      setCredentialModal({ fullnames: sk.fullnames, email: sk.email, tempPassword: res.data.tempPassword });
      toast.success("Password reset successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to reset password");
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await api.delete(`/storekeepers/${deleteTarget._id}`);
      toast.success("Storekeeper deleted successfully!");
      setDeleteTarget(null);
      fetchStorekeepers();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete storekeeper");
    } finally {
      setSaving(false);
    }
  };

  const copyCredentials = () => {
    const text = `Email: ${credentialModal.email}\nTemporary password: ${credentialModal.tempPassword}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white sm:text-2xl">Store Keepers</h2>
          <p className="text-sm text-ink-700/50 dark:text-white/40">Manage the accounts that run your inventory</p>
        </div>
        <button onClick={openCreate} className="btn-primary self-start">
          <Plus size={18} /> New Store Keeper
        </button>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-6">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-14" />)}
          </div>
        ) : storekeepers.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
            <Users size={40} className="text-brand-300" />
            <p className="font-display font-semibold text-ink-900 dark:text-white">No storekeepers yet</p>
            <p className="text-sm text-ink-700/50 dark:text-white/40">Add your first storekeeper to get their inventory started.</p>
            <button onClick={openCreate} className="btn-primary mt-2">
              <Plus size={16} /> New Store Keeper
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10">
                {storekeepers.map((sk, i) => (
                  <motion.tr
                    key={sk._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="table-row-hover"
                  >
                    <td className="font-medium text-ink-900 dark:text-white">{sk.fullnames}</td>
                    <td className="text-sm text-ink-700/70 dark:text-white/50">{sk.email}</td>
                    <td className="text-sm text-ink-700/70 dark:text-white/50">{sk.phone || "-"}</td>
                    <td>
                      {sk.isActive ? (
                        <span className="badge badge-success">Active</span>
                      ) : (
                        <span className="badge badge-danger">Deactivated</span>
                      )}
                      {sk.mustChangePassword && (
                        <span className="badge badge-warning ml-1.5">Pending setup</span>
                      )}
                    </td>
                    <td className="text-sm text-ink-700/70 dark:text-white/50">
                      {new Date(sk.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <button onClick={() => handleResetPassword(sk)} title="Reset password" className="rounded-lg p-1.5 text-ink-700/50 hover:bg-brand-50 hover:text-brand-600 dark:text-white/40 dark:hover:bg-white/10">
                          <KeyRound size={15} />
                        </button>
                        <button onClick={() => openEdit(sk)} title="Edit" className="rounded-lg p-1.5 text-ink-700/50 hover:bg-brand-50 hover:text-brand-600 dark:text-white/40 dark:hover:bg-white/10">
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setStatusTarget(sk)}
                          title={sk.isActive ? "Deactivate" : "Activate"}
                          className={`rounded-lg p-1.5 dark:hover:bg-white/10 ${sk.isActive ? "text-ink-700/50 hover:bg-amber-50 hover:text-amber-600 dark:text-white/40" : "text-ink-700/50 hover:bg-emerald-50 hover:text-emerald-600 dark:text-white/40"}`}
                        >
                          <Power size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(sk)} title="Delete" className="rounded-lg p-1.5 text-ink-700/50 hover:bg-rose-50 hover:text-rose-600 dark:text-white/40 dark:hover:bg-white/10">
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

      {/* Add/Edit modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Store Keeper" : "New Store Keeper"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-white/70">Full Names</label>
            <input
              type="text"
              value={form.fullnames}
              onChange={(e) => setForm({ ...form, fullnames: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800 dark:text-white/70">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field"
              required
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
          {!editing && (
            <p className="text-xs text-ink-700/50 dark:text-white/40">
              A temporary password will be generated automatically. The storekeeper must change it on first login.
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={saving}>
              {saving ? "Saving..." : editing ? "Update" : "Create Store Keeper"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Temp credentials reveal modal - shown once, right after create/reset */}
      <Modal isOpen={!!credentialModal} onClose={() => setCredentialModal(null)} title="Store Keeper Credentials" size="sm">
        {credentialModal && (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:ring-emerald-500/20">
              <CheckCircle2 size={22} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-sm text-ink-700/60 dark:text-white/50">
              Share these credentials with <strong>{credentialModal.fullnames}</strong> securely. This password won't be shown again.
            </p>
            <div className="space-y-2 rounded-xl bg-slate-50 p-4 text-left font-mono text-sm dark:bg-white/5">
              <p><span className="text-ink-700/50 dark:text-white/40">Email:</span> {credentialModal.email}</p>
              <p><span className="text-ink-700/50 dark:text-white/40">Temp password:</span> {credentialModal.tempPassword}</p>
            </div>
            <button onClick={copyCredentials} className="btn-secondary w-full">
              <Copy size={15} /> {copied ? "Copied!" : "Copy to clipboard"}
            </button>
            <button onClick={() => setCredentialModal(null)} className="btn-primary w-full">Done</button>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!statusTarget}
        onClose={() => setStatusTarget(null)}
        onConfirm={handleToggleStatus}
        loading={saving}
        confirmLabel={statusTarget?.isActive ? "Deactivate" : "Activate"}
        title={statusTarget?.isActive ? "Deactivate this storekeeper?" : "Activate this storekeeper?"}
        message={
          statusTarget?.isActive
            ? `"${statusTarget?.fullnames}" will be logged out immediately and won't be able to log back in until reactivated.`
            : `"${statusTarget?.fullnames}" will be able to log in again.`
        }
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={saving}
        title="Delete this storekeeper?"
        message={`"${deleteTarget?.fullnames}" and ALL of their inventory data (spares, stock records, categories, suppliers) will be permanently deleted. This cannot be undone.`}
      />
    </div>
  );
};

export default StoreKeepers;
