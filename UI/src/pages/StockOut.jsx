import { useState } from "react";

const StockOut = () => {
  const [form, setForm] = useState({
    spare: "",
    quantity: "",
    unitPrice: 10,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const totalPrice = (form.quantity || 0) * form.unitPrice;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Stock Out:", { ...form, totalPrice });
  };

  return (
    <div className="space-y-6">

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-800">
        Stock Out Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* FORM CARD */}
        <div className="bg-white p-6 rounded-xl shadow lg:col-span-1">

          <div className="flex items-center gap-3 mb-5">
            <div className="bg-red-100 p-3 rounded-lg">⬆️</div>
            <h2 className="text-lg font-semibold">Remove Stock</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Spare Part */}
            <div>
              <label className="text-sm text-gray-600">Spare Part</label>
              <select
                name="spare"
                onChange={handleChange}
                className="w-full mt-1 border p-2 rounded-lg focus:ring-2 focus:ring-red-200 outline-none"
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
                className="w-full mt-1 border p-2 rounded-lg focus:ring-2 focus:ring-red-200 outline-none"
              />
            </div>

            {/* Unit Price */}
            <div>
              <label className="text-sm text-gray-600">Unit Price</label>
              <input
                type="number"
                value={form.unitPrice}
                readOnly
                className="w-full mt-1 border p-2 rounded-lg bg-gray-100"
              />
            </div>

            {/* Total Price */}
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-sm text-gray-600">Total Price</p>
              <h3 className="text-xl font-bold text-red-600">
                ${totalPrice || 0}
              </h3>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
            >
              Remove Stock
            </button>
          </form>
        </div>

        {/* SUMMARY CARDS */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-lg">📉</div>
            <div>
              <p className="text-sm text-gray-500">Today Stock Out</p>
              <h2 className="text-xl font-bold">85 Units</h2>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-lg">💰</div>
            <div>
              <p className="text-sm text-gray-500">Loss Value</p>
              <h2 className="text-xl font-bold">$3,240</h2>
            </div>
          </div>

          {/* RECENT STOCK OUT TABLE */}
          <div className="bg-white p-5 rounded-xl shadow md:col-span-2">

            <h2 className="font-semibold mb-4">Recent Stock Out</h2>

            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Part</th>
                  <th className="p-2 text-left">Qty</th>
                  <th className="p-2 text-left">Total</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">
                  <td className="p-2">04/10/2026</td>
                  <td>Air Filter</td>
                  <td>25</td>
                  <td>$250</td>
                </tr>
                <tr className="border-t">
                  <td className="p-2">04/09/2026</td>
                  <td>Timing Belt</td>
                  <td>15</td>
                  <td>$450</td>
                </tr>
                <tr className="border-t">
                  <td className="p-2">04/08/2026</td>
                  <td>Wheel Bearing</td>
                  <td>35</td>
                  <td>$780</td>
                </tr>
              </tbody>
            </table>

            <button className="mt-4 text-blue-600 text-sm hover:underline">
              View Full History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockOut;