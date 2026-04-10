import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "sonner";

const Spares = () => {
  const [spares, setSpares] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    unitPrice: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/spares', form, { withCredentials: true })
      toast.success(res.data.message)
      setForm({name: "",
        category: "",
        quantity: "",
        unitPrice: "",
      })
    } catch (error) {
      toast.error(error.response?.data?.error)
    }

  };

  const getSpares = async () => {
    try {
      const spare = await axios.get('http://localhost:8000/spares', { withCredentials: true })
      setSpares(spare.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getSpares()
  },[])
  return (
    <div className="space-y-6">

      {/* Form */}
      <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4">Add Spare</h2>

        <div className="grid grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border p-2 rounded" />
          <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="border p-2 rounded" />
          <input name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" type="number" className="border p-2 rounded" />
          <input name="unitPrice" value={form.unitPrice} onChange={handleChange} placeholder="Unit Price" type="number" className="border p-2 rounded" />
        </div>

        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Spare
        </button>
      </form>

      {/* Table */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4">All Spares</h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th>N#</th>
              <th>Name</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {spares.map((s, i) => (
              <tr key={i} className="border-t">
                <td>{i + 1}</td>
                <td>{s.name}</td>
                <td>{s.category}</td>
                <td>{s.quantity}</td>
                <td>{s.unitPrice}</td>
                <td>{s.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Spares;