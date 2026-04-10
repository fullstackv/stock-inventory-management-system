import { useState } from "react";

const StockIn = () => {
  const [form, setForm] = useState({
    spare: "",
    quantity: "",
    date: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Stock In:", form);
  };

  return (
    <div className="space-y-6">

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-800">
        Stock In Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Form Card */}
        <div className="bg-white p-6 rounded-xl shadow lg:col-span-1">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-green-100 p-3 rounded-lg">⬇️</div>
            <h2 className="text-lg font-semibold">Add Stock In</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Spare Part */}
            <div>
              <label className="text-sm text-gray-600">Spare Part</label>
              <select
                name="spare"
                onChange={handleChange}
                className="w-full mt-1 border p-2 rounded-lg focus:ring-2 focus:ring-green-200 outline-none"
              >
                <option value="">Select Spare</option>
                <option value="Brake Pad">Brake Pad</option>
                <option value="Oil Filter">Oil Filter</option>
                <option value="Spark Plug">Spark Plug</option>
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="text-sm text-gray-600">Quantity</label>
              <input
                type="number"
                name="quantity"
                placeholder="Enter quantity"
                onChange={handleChange}
                className="w-full mt-1 border p-2 rounded-lg focus:ring-2 focus:ring-green-200 outline-none"
              />
            </div>

            {/* Date */}
            <div>
              <label className="text-sm text-gray-600">Date</label>
              <input
                type="date"
                name="date"
                onChange={handleChange}
                className="w-full mt-1 border p-2 rounded-lg focus:ring-2 focus:ring-green-200 outline-none"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Add Stock In
            </button>
          </form>
        </div>

        {/* Summary Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">📦</div>
            <div>
              <p className="text-sm text-gray-500">Today Stock In</p>
              <h2 className="text-xl font-bold">120 Units</h2>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">📈</div>
            <div>
              <p className="text-sm text-gray-500">This Week</p>
              <h2 className="text-xl font-bold">540 Units</h2>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white p-5 rounded-xl shadow md:col-span-2">

            <h2 className="font-semibold mb-4">Recent Stock In</h2>

            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Part</th>
                  <th className="p-2 text-left">Qty</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">
                  <td className="p-2">04/22/2026</td>
                  <td>Brake Pad</td>
                  <td>50</td>
                </tr>
                <tr className="border-t">
                  <td className="p-2">04/21/2026</td>
                  <td>Oil Filter</td>
                  <td>30</td>
                </tr>
                <tr className="border-t">
                  <td className="p-2">04/20/2026</td>
                  <td>Spark Plug</td>
                  <td>40</td>
                </tr>
              </tbody>
            </table>

            <button className="mt-4 text-blue-600 text-sm hover:underline">
              View All Records
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockIn;