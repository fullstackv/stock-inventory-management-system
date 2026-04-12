import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { PlusCircle, Package } from "lucide-react";

const StockOut = () => {
  const [stockOut, setStockOut] = useState([]);
  const [spares, setSpares] = useState([]);
  const [form, setForm] = useState({
    spare_id: "",
    stockOutQuantity: "",
    stockOutDate: ""
  });

  const [totalPrice, setTotalPrice] = useState(0);

  // FETCH DATA
  const fetchData = async () => {
    try {
      const stockRes = await axios.get("http://localhost:8000/stockout", { withCredentials: true });
      const spareRes = await axios.get("http://localhost:8000/spares", { withCredentials: true });

      setStockOut(stockRes.data);
      setSpares(spareRes.data);
    } catch (error) {
      toast.error(error.response?.data?.error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);

    if (updated.spare_id && updated.stockOutQuantity) {
      const spare = spares.find((s) => s.id == updated.spare_id);
      if (spare) {
        setTotalPrice(spare.unitPrice * updated.stockOutQuantity);
      }
    }
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/stockout", form, { withCredentials: true });
      toast.success(res.data.message);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error);
    }
  };

  // FORMAT DATE
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };


  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Stock Out</h2>

      <div className="grid lg:grid-cols-3 gap-6">

        <div className="bg-white shadow-md rounded-xl p-6 h-fit">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <Package size={18} />
            Remove Stock
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">

            <select
              name="spare_id"
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">Select Spare</option>
              {spares.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="stockOutQuantity"
              placeholder="Quantity"
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500"
              required
            />

            <input
              type="date"
              name="stockOutDate"
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500"
              required
            />

            <div className="bg-gray-100 p-3 rounded-lg flex justify-between text-sm">
              <span className="text-gray-600">Total Price:</span>
              <span className="font-bold text-red-600">
                {totalPrice}
              </span>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg 
                         hover:bg-red-700 hover:scale-[1.02] transition-all duration-300"
            >
              <PlusCircle size={18} />
              Remove Stock
            </button>
          </form>
        </div>

        <div className="col-span-2 bg-white shadow-md rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Stock Out Records</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">

              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="text-left px-4 py-2">#</th>
                  <th className="text-left px-4 py-2">Spare</th>
                  <th className="text-left px-4 py-2">Quantity</th>
                  <th className="text-left px-4 py-2">Total Price</th>
                  <th className="text-left px-4 py-2">Date</th>
                </tr>
              </thead>

              <tbody>
                {stockOut.length > 0 ? (
                  stockOut.map((item, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50 transition">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2 font-medium">{item.name}</td>
                      <td className="px-4 py-2">{item.stockOutQuantity}</td>
                      <td className="px-4 py-2 text-red-600 font-semibold">
                        {item.stockOutTotalPrice}
                      </td>
                      <td className="px-4 py-2">
                        {formatDate(item.stockOutDate)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No stock out records found
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

export default StockOut;