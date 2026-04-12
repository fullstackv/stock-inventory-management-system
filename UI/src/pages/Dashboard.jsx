import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Package,
  DollarSign,
  ArrowDownCircle,
  ArrowUpCircle
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [spares, setSpares] = useState([]);
  const [stockIn, setStockIn] = useState([]);
  const [stockOut, setStockOut] = useState([]);

  const navigate = useNavigate();

  // FETCH ALL DATA
  const fetchData = async () => {
    try {
      const userRes = await axios.get("http://localhost:8000/dashboard", { withCredentials: true });
      const spareRes = await axios.get("http://localhost:8000/spares", { withCredentials: true });
      const inRes = await axios.get("http://localhost:8000/stockin", { withCredentials: true });
      const outRes = await axios.get("http://localhost:8000/stockout", { withCredentials: true });

      setUser(userRes.data.user);
      setSpares(spareRes.data);
      setStockIn(inRes.data);
      setStockOut(outRes.data);

    } catch (error) {
      toast.error(error.response?.data?.error);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalSpares = spares.length;
  const totalValue = spares.reduce((sum, s) => sum + Number(s.totalPrice), 0);

  const totalStockIn = stockIn.reduce((sum, s) => sum + s.stockInQuantity, 0);
  const totalStockOut = stockOut.reduce((sum, s) => sum + s.stockOutQuantity, 0);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short"
    });

  const barData = [
    { name: "Stock In", value: totalStockIn },
    { name: "Stock Out", value: totalStockOut }
  ];

  const pieData = spares.slice(0, 5).map((s) => ({
    name: s.name,
    value: s.quantity
  }));

  const COLORS = ["#3b82f6", "#22c55e", "#ef4444", "#f59e0b", "#8b5cf6"];

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold text-gray-800">
        Welcome, {user?.fullnames || "User"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="bg-white p-5 rounded-xl shadow flex items-center justify-between 
                        hover:shadow-lg hover:-translate-y-1 transition">
          <div>
            <p className="text-gray-500 text-sm">Total Spares</p>
            <h2 className="text-xl font-bold">{totalSpares}</h2>
          </div>
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
            <Package />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center justify-between 
                        hover:shadow-lg hover:-translate-y-1 transition">
          <div>
            <p className="text-gray-500 text-sm">Stock Value</p>
            <h2 className="text-xl font-bold">{totalValue.toLocaleString()}</h2>
          </div>
          <div className="bg-green-100 text-green-600 p-3 rounded-full">
            <DollarSign />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center justify-between 
                        hover:shadow-lg hover:-translate-y-1 transition">
          <div>
            <p className="text-gray-500 text-sm">Stock In</p>
            <h2 className="text-xl font-bold">{totalStockIn}</h2>
          </div>
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
            <ArrowDownCircle />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center justify-between 
                        hover:shadow-lg hover:-translate-y-1 transition">
          <div>
            <p className="text-gray-500 text-sm">Stock Out</p>
            <h2 className="text-xl font-bold">{totalStockOut}</h2>
          </div>
          <div className="bg-red-100 text-red-600 p-3 rounded-full">
            <ArrowUpCircle />
          </div>
        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Recent Stock In</h2>

          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Part</th>
                <th className="p-2 text-left">Qty</th>
              </tr>
            </thead>
            <tbody>
              {stockIn.slice(0, 5).map((item, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{formatDate(item.stockInDate)}</td>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.stockInQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Recent Stock Out</h2>

          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Part</th>
                <th className="p-2 text-left">Qty</th>
              </tr>
            </thead>
            <tbody>
              {stockOut.slice(0, 5).map((item, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{formatDate(item.stockOutDate)}</td>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.stockOutQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Stock Movement</h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Stock Distribution</h2>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={80}>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;