import axios from "axios";
import { LogOut } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Header = () => {
   const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const fetchLoggedInUser = async () => {
    try {
      const res = await axios.get('http://localhost:8000/dashboard', { withCredentials: true })
      setUser(res.data.user)
    } catch (error) {
      console.error(error)
      navigate('/login')
    }
  }

  useEffect(()=>{
    fetchLoggedInUser()
  },[])

  const handleLogout = async () => {
    try {
      const res = await axios.post('http://localhost:8000/logout',{}, {withCredentials: true})
      toast.success(res.data.message)
      navigate('/login')
    } catch (error) {
      toast.error("Failed to logout")
    }
  }

  return (
    <div className="bg-gradient-to-r from-slate-700 to-indigo-950 text-white px-6 py-4 flex items-center justify-between shadow-md">

      {/* Left Logo */}
      <div className="flex items-center gap-3">
        <div className="bg-white text-blue-700 font-bold px-2 py-1 rounded">
          📦
        </div>
        <h1 className="text-xl font-bold tracking-wide">SIMS</h1>
      </div>

      {/* Center Navigation */}
      <nav className="hidden md:flex gap-6 text-sm font-medium">
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/spares" className="hover:underline">Spare Parts</Link>
        <Link to="/stock-in" className="hover:underline">Stock In</Link>
        <Link to="/stock-out" className="hover:underline">Stock Out</Link>
        <Link to="/reports" className="hover:underline">Reports</Link>
      </nav>

      {/* Right Side */}
      {user && (
        <div className="flex items-center gap-4">
        <span className="text-sm">Welcome, {user.names}</span>

        <button
          onClick={handleLogout}
          className="px-3 py-1 rounded transition"
        >
          <LogOut className="text-amber-600 hover:text-red-700" />
        </button>
      </div>
      )}
    </div>
  );
};

export default Header;