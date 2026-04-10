import { useState } from "react";

const Reports = () => {
  const [filters, setFilters] = useState({
    type: "both",
    date: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Dummy data (replace later with API data)
  const stockInData = [
    { date: "2026-04-10", part: "Brake Pad", qty: 50, type: "in" },
    { date: "2026-04-09", part: "Oil Filter", qty: 30, type: "in" },
  ];

  const stockOutData = [
    { date: "2026-04-10", part: "Air Filter", qty: 20, total: 200, type: "out" },
    { date: "2026-04-08", part: "Timing Belt", qty: 10, total: 500, type: "out" },
  ];

  // Merge data
  let data =
    filters.type === "in"
      ? stockInData
      : filters.type === "out"
      ? stockOutData
      : [...stockInData, ...stockOutData];

  // Filter by date
  if (filters.date) {
    data = data.filter((item) => item.date === filters.date);
  }

  return (
    <div className="space-y-6">

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-800">
        Stock Reports
      </h1>

      {/* FILTER SECTION */}
      <div className="bg-white p-5 rounded-xl shadow grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Type Filter */}
        <div>
          <label className="text-sm text-gray-600">Report Type</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="w-full mt-1 border p-2 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
          >
            <option value="both">Overral report</option>
            <option value="in">Stock In</option>
            <option value="out">Stock Out</option>
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label className="text-sm text-gray-600">Date</label>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleChange}
            className="w-full mt-1 border p-2 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
          />
        </div>

        {/* Reset */}
        <div className="flex items-end">
          <button
            onClick={() => setFilters({ type: "both", date: "" })}
            className="w-full bg-gray-100 hover:bg-gray-200 py-2 rounded-lg text-sm"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg">⬇️</div>
          <div>
            <p className="text-sm text-gray-500">Total Stock In</p>
            <h2 className="text-xl font-bold">
              {stockInData.reduce((a, b) => a + b.qty, 0)} Units
            </h2>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-lg">⬆️</div>
          <div>
            <p className="text-sm text-gray-500">Total Stock Out</p>
            <h2 className="text-xl font-bold">
              {stockOutData.reduce((a, b) => a + b.qty, 0)} Units
            </h2>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg">📊</div>
          <div>
            <p className="text-sm text-gray-500">Net Movement</p>
            <h2 className="text-xl font-bold">
              {stockInData.reduce((a, b) => a + b.qty, 0) -
                stockOutData.reduce((a, b) => a + b.qty, 0)}{" "}
              Units
            </h2>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white p-5 rounded-xl shadow">

        <h2 className="font-semibold mb-4">Report Results</h2>

        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Part</th>
              <th className="p-2 text-left">Qty</th>
              <th className="p-2 text-left">Total</th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{item.date}</td>

                  <td className="p-2">
                    {item.type === "in" ? (
                      <span className="text-green-600 font-medium">
                        Stock In
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        Stock Out
                      </span>
                    )}
                  </td>

                  <td className="p-2">{item.part}</td>
                  <td className="p-2">{item.qty}</td>
                  <td className="p-2">
                    {item.total ? `$${item.total}` : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No data found for selected filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;