import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FileBarChart2, Download, FileText, ArrowDownToLine, ArrowUpFromLine,
  DollarSign, AlertTriangle, SlidersHorizontal, Filter
} from "lucide-react";
import { toast } from "sonner";
import api from "../api/axios";
import { formatFRW } from "../utils/currency";

const REPORT_TABS = [
  { id: "both", label: "Stock Movement", icon: FileBarChart2 },
  { id: "valuation", label: "Stock Valuation", icon: DollarSign },
  { id: "lowstock", label: "Low Stock", icon: AlertTriangle },
  { id: "adjustments", label: "Adjustments", icon: SlidersHorizontal },
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState("both");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [filters, setFilters] = useState({ startDate: "", endDate: "", category_id: "", supplier_id: "" });

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [catRes, supRes] = await Promise.all([api.get("/categories"), api.get("/suppliers")]);
        setCategories(catRes.data);
        setSuppliers(supRes.data);
      } catch (error) {
        console.error("Fetch lookups error:", error);
      }
    };
    fetchLookups();
  }, []);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const params = { type: activeTab };
      if (activeTab === "both" || activeTab === "stockin" || activeTab === "stockout") {
        if (filters.startDate && filters.endDate) {
          params.startDate = filters.startDate;
          params.endDate = filters.endDate;
        }
      }
      if (activeTab === "both" || activeTab === "valuation") {
        if (filters.category_id) params.category_id = filters.category_id;
        if (filters.supplier_id) params.supplier_id = filters.supplier_id;
      }
      const res = await api.get("/reports", { params });
      setRows(res.data);
    } catch (error) {
      console.error("Fetch report error:", error);
      toast.error("Failed to load report");
    } finally {
      setLoading(false);
    }
  }, [activeTab, filters]);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  const columnsByTab = {
    both: [
      { key: "type", label: "Type" },
      { key: "name", label: "Item" },
      { key: "sku", label: "SKU" },
      { key: "quantity", label: "Qty" },
      { key: "date", label: "Date", format: (v) => new Date(v).toLocaleDateString() },
    ],
    valuation: [
      { key: "name", label: "Item" },
      { key: "sku", label: "SKU" },
      { key: "category", label: "Category" },
      { key: "supplier", label: "Supplier" },
      { key: "quantity", label: "Qty" },
      { key: "unitPrice", label: "Unit Price", format: (v) => formatFRW(v) },
      { key: "totalPrice", label: "Total Value", format: (v) => formatFRW(v) },
    ],
    lowstock: [
      { key: "name", label: "Item" },
      { key: "sku", label: "SKU" },
      { key: "category", label: "Category" },
      { key: "quantity", label: "In Stock" },
      { key: "min_stock_level", label: "Reorder Level" },
    ],
    adjustments: [
      { key: "date", label: "Date", format: (v) => new Date(v).toLocaleString() },
      { key: "name", label: "Item" },
      { key: "adjustment_type", label: "Type" },
      { key: "quantity", label: "Qty" },
      { key: "reason", label: "Reason" },
      { key: "adjusted_by", label: "By" },
    ],
  };

  const columns = columnsByTab[activeTab] || columnsByTab.both;

  const summary = (() => {
    if (activeTab === "both") {
      const inTotal = rows.filter((r) => r.type === "IN").reduce((sum, r) => sum + Number(r.quantity), 0);
      const outTotal = rows.filter((r) => r.type === "OUT").reduce((sum, r) => sum + Number(r.quantity), 0);
      return [
        { label: "Stock In", value: inTotal, icon: ArrowDownToLine, tone: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10" },
        { label: "Stock Out", value: outTotal, icon: ArrowUpFromLine, tone: "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10" },
        { label: "Net Change", value: inTotal - outTotal, icon: FileBarChart2, tone: "text-brand-600 bg-brand-50 dark:text-brand-400 dark:bg-brand-500/10" },
      ];
    }
    if (activeTab === "valuation") {
      const totalValue = rows.reduce((sum, r) => sum + Number(r.totalPrice), 0);
      return [
        { label: "Total Items", value: rows.length, icon: FileText, tone: "text-brand-600 bg-brand-50 dark:text-brand-400 dark:bg-brand-500/10" },
        { label: "Total Stock Value", value: formatFRW(totalValue), icon: DollarSign, tone: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10" },
      ];
    }
    if (activeTab === "lowstock") {
      return [{ label: "Items Needing Reorder", value: rows.length, icon: AlertTriangle, tone: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10" }];
    }
    return [{ label: "Total Adjustments", value: rows.length, icon: SlidersHorizontal, tone: "text-brand-600 bg-brand-50 dark:text-brand-400 dark:bg-brand-500/10" }];
  })();

  const exportCSV = () => {
    if (rows.length === 0) return toast.error("Nothing to export");
    const headers = columns.map((c) => c.label).join(",");
    const csvRows = rows.map((row) =>
      columns.map((c) => {
        const val = c.format ? c.format(row[c.key]) : row[c.key];
        return `"${String(val ?? "").replace(/"/g, '""')}"`;
      }).join(",")
    );
    const csv = [headers, ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab}-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully!");
  };

  const exportPDF = () => {
    if (rows.length === 0) return toast.error("Nothing to export");
    const doc = new jsPDF();
    const tabLabel = REPORT_TABS.find((t) => t.id === activeTab)?.label || "Report";

    doc.setFillColor(234, 88, 12);
    doc.rect(0, 0, 210, 24, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("SIMS - Stock Inventory Management System", 14, 12);
    doc.setFontSize(11);
    doc.text(`${tabLabel} Report`, 14, 19);

    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.text(`Generated on ${new Date().toLocaleString()} · Currency: FRW`, 14, 30);

    autoTable(doc, {
      startY: 36,
      head: [columns.map((c) => c.label)],
      body: rows.map((row) => columns.map((c) => {
        const val = c.format ? c.format(row[c.key]) : row[c.key];
        return String(val ?? "-");
      })),
      headStyles: { fillColor: [234, 88, 12], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [255, 247, 237] },
      styles: { fontSize: 9, cellPadding: 3 },
    });

    doc.save(`${activeTab}-report-${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success("PDF exported successfully!");
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white sm:text-2xl">Reports & Analytics</h2>
        <p className="text-sm text-ink-700/50 dark:text-white/40">Movement, valuation, low stock and adjustment reports</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {REPORT_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.id ? "text-white" : "bg-white text-ink-700/60 hover:text-ink-900 border border-black/10 dark:bg-ink-800 dark:text-white/50 dark:border-white/10 dark:hover:text-white"
            }`}
          >
            {activeTab === tab.id && (
              <motion.div layoutId="report-tab-pill" className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-600 to-red-500 shadow-glow" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
            )}
            <tab.icon size={15} className="relative z-10" />
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="card flex flex-wrap items-center gap-3 p-4">
        <Filter size={16} className="text-ink-700/40 dark:text-white/30" />
        {(activeTab === "both") && (
          <>
            <input type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} className="input-field !w-auto" />
            <span className="text-sm text-ink-700/40 dark:text-white/30">to</span>
            <input type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} className="input-field !w-auto" />
          </>
        )}
        {(activeTab === "both" || activeTab === "valuation") && (
          <>
            <select value={filters.category_id} onChange={(e) => setFilters({ ...filters, category_id: e.target.value })} className="select-field !w-auto">
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <select value={filters.supplier_id} onChange={(e) => setFilters({ ...filters, supplier_id: e.target.value })} className="select-field !w-auto">
              <option value="">All Suppliers</option>
              {suppliers.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </>
        )}
        <div className="ml-auto flex gap-2">
          <button onClick={exportCSV} className="btn-secondary !px-3 !py-2 text-sm"><Download size={14} /> CSV</button>
          <button onClick={exportPDF} className="btn-primary !px-3 !py-2 text-sm"><FileText size={14} /> PDF</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {summary.map((s) => (
          <div key={s.label} className="card flex items-center gap-3 p-4">
            <div className={`rounded-xl p-2.5 ${s.tone}`}>
              <s.icon size={18} />
            </div>
            <div>
              <p className="text-xs text-ink-700/50 dark:text-white/40">{s.label}</p>
              <p className="font-display text-lg font-bold text-ink-900 dark:text-white">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-6">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-12" />)}
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
            <FileBarChart2 size={40} className="text-brand-300" />
            <p className="font-display font-semibold text-ink-900 dark:text-white">No data for this report</p>
            <p className="text-sm text-ink-700/50 dark:text-white/40">Try adjusting the filters above.</p>
          </div>
        ) : (
          <div className="max-h-[520px] overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0">
                <tr>
                  {columns.map((c) => <th key={c.key}>{c.label}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10">
                {rows.map((row, i) => (
                  <tr key={i} className="table-row-hover">
                    {columns.map((c) => (
                      <td key={c.key} className="text-sm text-ink-700/80 dark:text-white/60">
                        {c.key === "type" ? (
                          <span className={`badge ${row.type === "IN" ? "badge-success" : "badge-danger"}`}>
                            {row.type === "IN" ? <ArrowDownToLine size={11} /> : <ArrowUpFromLine size={11} />} {row.type}
                          </span>
                        ) : c.key === "adjustment_type" ? (
                          <span className={`badge ${row.adjustment_type === "increase" ? "badge-success" : "badge-danger"}`}>
                            {row.adjustment_type}
                          </span>
                        ) : c.format ? c.format(row[c.key]) : (row[c.key] ?? "-")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
