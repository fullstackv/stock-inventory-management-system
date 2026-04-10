import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
   const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const fetchLoggedInUser = async () => {
    try {
      const res = await axios.get('http://localhost:8000/dashboard', { withCredentials: true })
      setUser(res.data.user)
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.error)
      navigate('/login')
    }
  }
  useEffect(()=>{
    fetchLoggedInUser()
  })
  return (
    <div className="space-y-6">

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-800">
        Dashboard Overview
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg">📦</div>
          <div>
            <p className="text-gray-500 text-sm">Total Spare Parts</p>
            <h2 className="text-xl font-bold">152 Items</h2>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg">💲</div>
          <div>
            <p className="text-gray-500 text-sm">Total Stock Value</p>
            <h2 className="text-xl font-bold">$24,580.00</h2>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg">⬇️</div>
          <div>
            <p className="text-gray-500 text-sm">Stock In This Month</p>
            <h2 className="text-xl font-bold">320 Units</h2>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-lg">⬆️</div>
          <div>
            <p className="text-gray-500 text-sm">Stock Out This Month</p>
            <h2 className="text-xl font-bold">210 Units</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Recent Stock In</h2>

          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Part Name</th>
                <th className="p-2 text-left">Qty</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-2">04/22/2024</td>
                <td>Brake Pads</td>
                <td>50</td>
              </tr>
              <tr className="border-t">
                <td className="p-2">04/20/2024</td>
                <td>Oil Filter</td>
                <td>30</td>
              </tr>
              <tr className="border-t">
                <td className="p-2">04/18/2024</td>
                <td>Spark Plug</td>
                <td>40</td>
              </tr>
            </tbody>
          </table>

          <button className="mt-4 text-blue-600 text-sm hover:underline">
            View All
          </button>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Recent Stock Out</h2>

          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Part Name</th>
                <th className="p-2 text-left">Qty</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-2">04/23/2024</td>
                <td>Air Filter</td>
                <td>25</td>
              </tr>
              <tr className="border-t">
                <td className="p-2">04/21/2024</td>
                <td>Timing Belt</td>
                <td>15</td>
              </tr>
              <tr className="border-t">
                <td className="p-2">04/19/2024</td>
                <td>Wheel Bearing</td>
                <td>35</td>
              </tr>
            </tbody>
          </table>

          <button className="mt-4 text-blue-600 text-sm hover:underline">
            View All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Stock Levels Overview</h2>
          <div className="h-40 flex items-center justify-center text-gray-400">
            Chart Coming Soon 📊
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Stock Distribution</h2>
          <div className="h-40 flex items-center justify-center text-gray-400">
            Pie Chart Coming Soon 🥧
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;