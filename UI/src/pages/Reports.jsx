import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { FileDown, Printer, Filter } from "lucide-react";

const Reports = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    type: "both",
    startDate: "",
    endDate: ""
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fetchReport = async () => {
    try {
      const res = await axios.get("http://localhost:8000/reports", {
        params: filters,
        withCredentials: true
      });
      setData(res.data);
      toast.success("Report loaded");
    } catch (error) {
      toast.error("Failed to load report");
    }
  };

  // EXPORT CSV
  const exportCSV = () => {
    const csv = [
      ["Type", "Spare", "Quantity", "Date"],
      ...data.map((row) => [row.type, row.name, row.quantity, row.date])
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "report.csv";
    a.click();
  };

  // PRINT
  const handlePrint = () => {
    window.print();
  };

  // FORMAT DATE
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB");

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">

      <h1 className="text-2xl font-bold text-gray-800">Reports</h1>

      <div className="bg-white p-5 rounded-xl shadow grid md:grid-cols-4 gap-4">

        <select
          name="type"
          onChange={handleChange}
          className="border p-2 rounded-lg"
        >
          <option value="both">Both</option>
          <option value="stockin">Stock In</option>
          <option value="stockout">Stock Out</option>
        </select>

        <input
          type="date"
          name="startDate"
          onChange={handleChange}
          className="border p-2 rounded-lg"
        />

        <input
          type="date"
          name="endDate"
          onChange={handleChange}
          className="border p-2 rounded-lg"
        />

        <button
          onClick={fetchReport}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Filter size={18} />
          View Report
        </button>
      </div>

      <div className="flex gap-4">

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <FileDown size={18} />
          Export
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          <Printer size={18} />
          Print
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Report Results</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full">

            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Spare</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((row, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          row.type === "IN"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {row.type}
                      </span>
                    </td>

                    <td className="p-3">{row.name}</td>
                    <td className="p-3">{row.quantity}</td>
                    <td className="p-3">{formatDate(row.date)}</td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    No report data
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;