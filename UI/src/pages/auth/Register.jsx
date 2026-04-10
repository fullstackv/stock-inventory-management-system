import { useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff, Box, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from 'axios'

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullnames: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const users = await axios.post('http://localhost:8000/register',form)
      toast.success(users.data.message)
      setForm({fullnames: "", email: "", phone: "", password: "",})
      navigate('/login')
    } catch (error) {
      toast.error(error.response.data.error)
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* LEFT SIDE - INFO PANEL */}
      <div className="md:w-1/2 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white flex items-center justify-center p-10">

        <div className="max-w-md">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white/20 p-3 rounded-xl">
              <Box className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-widest">SIMS</h1>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-4 text-cyan-500">
            Stock Inventory Management System
          </h2>

          <p className="text-blue-100 mb-6">
            Manage your spare parts, stock in, stock out, and reporting in one
            powerful system designed for efficiency and accuracy.
          </p>

          {/* Features */}
          <div className="space-y-3">

            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-orange-700" />
              <span>Real-time stock tracking</span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-orange-700" />
              <span>Inventory reports & analytics</span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-orange-700" />
              <span>Fast stock in & stock out processing</span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-orange-700" />
              <span>Secure and role-based access</span>
            </div>

          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="md:w-1/2 flex items-center justify-center bg-gray-100 p-6">

        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 p-6 flex flex-col items-center">
            <div className="bg-cyan-800 p-3 rounded-xl mb-3">
              <Box className="text-white w-10 h-10" />
            </div>
            <h1 className="text-white text-2xl font-bold tracking-widest">
              CREATE ACCOUNT
            </h1>
          </div>

          {/* Body */}
          <div className="p-6">

            <p className="text-center text-sm text-gray-500 mb-6">
              Join SIMS to manage your inventory
            </p>

            <form onSubmit={handleRegister}>

              {/* Full Name */}
              <div className="relative mb-4">
                <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="fullnames"
                  value={form.fullnames}
                  placeholder="Full Names"
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              {/* Email */}
              <div className="relative mb-4">
                <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  placeholder="Email Address"
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              {/* Phone */}
              <div className="relative mb-4">
                <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  placeholder="Phone Number"
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>

              {/* Password */}
              <div className="relative mb-4">
                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  placeholder="Password"
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <div
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>

              {/* Button */}
              <button className="w-full bg-gradient-to-r from-cyan-600 to-cyan-800 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition">
                Create Account
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm mt-5 text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 font-medium hover:underline">
                Login
              </a>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;