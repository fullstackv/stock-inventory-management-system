import { useEffect, useState } from "react";
import {
  Box,
  Package,
  TrendingUp,
  BarChart3,
  Shield,
  Users,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  

const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white">

      {/* NAVBAR */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all ${
          scrolled
            ? "bg-black/60 backdrop-blur-md border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-10 py-4">

          <div className="flex items-center gap-2 cursor-pointer">
            <Box className="text-orange-800 font-bold" size={35} />
            <h1 className="font-bold tracking-widest text-2xl">SIMS</h1>
          </div>

          <div className="hidden md:flex gap-6 text-sm text-gray-300">
            <a href="#about" className="hover:text-orange-400">Why SIMS</a>
            <a href="#dashboard" className="hover:text-orange-400">Dashboard</a>
            <a href="#testimony" className="hover:text-orange-400">Testimonial</a>
            <a href="#contact" className="hover:text-orange-400">Contact us</a>
          </div>

          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative px-6 py-28 text-center overflow-hidden">

        {/* subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,200,255,0.12),transparent_60%)]"></div>

        <div className="relative z-10 max-w-4xl mx-auto">

            {/* Badge */}
            <div className="inline-block px-4 py-1 mb-6 text-xs rounded-full bg-white/10 border border-white/10">
            🚀 Modern Inventory Solution for Businesses
            </div>

            {/* Main Headline (VERY IMPORTANT - NO ANIMATION) */}
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Manage Your Inventory <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">
                with Full Control & Accuracy
            </span>
            </h1>

            {/* Sub text */}
            <p className="mt-6 text-gray-300 text-lg max-w-2xl mx-auto">
            SIMS helps you track stock in real-time, manage spare parts efficiently,
            and generate reliable reports to improve business decisions.
            </p>

            {/* CTA */}
            <div className="mt-8 flex justify-center gap-4">
            <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-800 hover:opacity-90 transition"
            >
                Get Started
            </Link>

            <a
                href="#features"
                className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10"
            >
                Explore Features
            </a>
            </div>

            {/* Trust row */}
            <div className="mt-10 flex flex-wrap justify-center gap-6 text-gray-400 text-sm">
            <span>✔ Real-time tracking</span>
            <span>✔ Secure system</span>
            <span>✔ Fast performance</span>
            <span>✔ Easy reporting</span>
            </div>

        </div>
        </section>

      {/* FEATURES */}
      <section id="features" className="px-8 py-20">
        <h2 className="text-center text-3xl font-bold mb-12">Features</h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

          {[
            { icon: <Package className="text-cyan-400" />, title: "Inventory Tracking", desc: "Track all spare parts in real time." },
            { icon: <TrendingUp className="text-green-400" />, title: "Stock Movement", desc: "Manage stock in and out easily." },
            { icon: <BarChart3 className="text-purple-400" />, title: "Reports", desc: "Generate smart analytics." },
            { icon: <Shield className="text-red-400" />, title: "Security", desc: "Role-based secure access." },
            { icon: <Users className="text-pink-400" />, title: "Users", desc: "Manage staff accounts." },
            { icon: <Box className="text-yellow-400" />, title: "Spare Parts", desc: "Organize inventory efficiently." },
          ].map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:scale-105 transition"
            >
              <div className="mb-3">{f.icon}</div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-gray-400 text-sm mt-2">{f.desc}</p>
            </div>
          ))}

        </div>
      </section>

      <section id="dashboard" className="py-24 px-6">

        <h2 className="text-center text-3xl font-bold mb-14">
            Powerful Inventory Dashboard
        </h2>

        {/* SPLIT SECTION */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

            {/* LEFT - DASHBOARD PREVIEW (FLOATING CARD) */}
            <div className="relative">

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md">

                <h3 className="text-lg font-semibold mb-4 text-cyan-400">
                Live System Preview
                </h3>

                {/* mini cards */}
                <div className="grid grid-cols-2 gap-4">

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-gray-400 text-xs">Total Stock</p>
                    <p className="text-xl font-bold">152</p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-gray-400 text-xs">Stock In</p>
                    <p className="text-xl font-bold text-green-400">320</p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-gray-400 text-xs">Stock Out</p>
                    <p className="text-xl font-bold text-red-400">210</p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-gray-400 text-xs">Accuracy</p>
                    <p className="text-xl font-bold text-cyan-400">99%</p>
                </div>

                </div>

                {/* fake table */}
                <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">

                <p className="text-sm font-semibold mb-2 text-gray-300">
                    Recent Activity
                </p>

                <div className="space-y-2 text-xs text-gray-400">

                    <div className="flex justify-between">
                    <span>Brake Pads</span>
                    <span className="text-green-400">+50 Stock In</span>
                    </div>

                    <div className="flex justify-between">
                    <span>Oil Filter</span>
                    <span className="text-red-400">-20 Stock Out</span>
                    </div>

                </div>
                </div>

            </div>

            {/* glow effect */}
            <div className="absolute -inset-4 bg-cyan-500/10 blur-2xl rounded-3xl -z-10"></div>

            </div>

            {/* RIGHT - DESCRIPTION */}
            <div>

            <h3 className="text-2xl font-bold mb-4">
                Everything You Need to Manage Inventory
            </h3>

            <p className="text-gray-300 leading-relaxed mb-6">
                SIMS gives you full control over your stock operations.
                From tracking inventory in real-time to generating smart reports,
                everything is designed for speed, accuracy, and simplicity.
            </p>

            <div className="space-y-4 text-sm">

                <div className="flex items-start gap-3">
                <span className="text-cyan-400">✔</span>
                <p>Real-time stock tracking system</p>
                </div>

                <div className="flex items-start gap-3">
                <span className="text-cyan-400">✔</span>
                <p>Easy stock in and stock out management</p>
                </div>

                <div className="flex items-start gap-3">
                <span className="text-cyan-400">✔</span>
                <p>Advanced reporting and analytics</p>
                </div>

                <div className="flex items-start gap-3">
                <span className="text-cyan-400">✔</span>
                <p>Secure role-based access system</p>
                </div>

            </div>

            <Link to={'/login'}><button className="mt-6 px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-800 rounded-xl">
                Try Dashboard
            </button></Link>

            </div>

        </div>
        </section>

        <section id="testimony" className="py-24 px-6 bg-white/5 border-y border-white/10">

        <h2 className="text-center text-3xl font-bold mb-14">
            What Users Say
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

            {[
            {
                name: "John M.",
                role: "Warehouse Manager",
                text: "SIMS helped us reduce stock errors by more than 80%. Very easy to use.",
            },
            {
                name: "Sarah K.",
                role: "Inventory Officer",
                text: "The dashboard is clean and fast. I can now track everything in real time.",
            },
            {
                name: "David R.",
                role: "Business Owner",
                text: "This system improved how we manage spare parts. Highly recommended!",
            },
            ].map((t, i) => (
            <div
                key={i}
                className="p-6 rounded-2xl bg-white/5 border border-white/10"
            >
                <p className="text-gray-300 text-sm mb-4">"{t.text}"</p>

                <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
            </div>
            ))}

        </div>
        </section>



      {/* ABOUT */}
      <section id="about" className="py-24 px-8 bg-white/5 border-y border-white/10">

        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-3xl font-bold mb-6">About SIMS</h2>

          <p className="text-gray-300 leading-relaxed">
            SIMS (Stock Inventory Management System) is a modern solution designed
            to help businesses efficiently track inventory, manage stock movements,
            and generate real-time reports. Our goal is to reduce manual work,
            improve accuracy, and provide full control over stock operations.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-10 text-center">

            <div>
              <h3 className="text-orange-400 text-3xl font-bold">99%</h3>
              <p className="text-gray-400">Accuracy</p>
            </div>

            <div>
              <h3 className="text-orange-400 text-3xl font-bold">24/7</h3>
              <p className="text-gray-400">Availability</p>
            </div>

            <div>
              <h3 className="text-orange-400 text-3xl font-bold">Fast</h3>
              <p className="text-gray-400">Performance</p>
            </div>

          </div>

        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 px-8">

        <h2 className="text-center text-3xl font-bold mb-12">Contact Us</h2>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">

          {/* INFO */}
          <div className="space-y-6">

            <div className="flex items-center gap-3">
              <Mail className="text-orange-400" />
              <span>fullstackv@sims.com</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="text-orange-400" />
              <span>+250 785 683 347</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="text-orange-400" />
              <span>Kigali, Rwanda</span>
            </div>

          </div>

          {/* FORM */}
          <div className="space-y-4">
            <input
              placeholder="Your Name"
              className="w-full p-3 rounded-lg bg-white/5 focus:outline-none focus:ring-1 focus:ring-orange-400 border-orange-400/10"
            />
            <input
              placeholder="Your Email"
              className="w-full p-3 rounded-lg bg-white/5 border focus:outline-none focus:ring-1 focus:ring-orange-400 border-orange-400/10"
            />
            <textarea
              placeholder="Message"
              rows="4"
              className="w-full p-3 rounded-lg bg-white/5 border focus:outline-none focus:ring-1 focus:ring-orange-400 border-orange-400/10"
            />
            <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-800 rounded-lg">
              Send Message
            </button>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black/40 border-t border-white/10 py-12 px-8">

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {/* COLUMN 1 */}
          <div>
            <h3 className="font-bold text-lg mb-3 text-orange-600">SIMS</h3>
            <p className="text-gray-400 text-sm">
              Smart Inventory Management System for modern businesses.
            </p>
          </div>

          {/* COLUMN 2 */}
          <div>
            <h3 className="font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#features">Features</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          {/* COLUMN 3 */}
          <div>
            <h3 className="font-bold mb-3">System</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Login</li>
              <li>Register</li>
              <li>Dashboard</li>
            </ul>
          </div>

        </div>

        <p className="text-center text-gray-500 text-sm mt-10">
          © {new Date().getFullYear()} SIMS. All rights reserved.
        </p>
      </footer>

    </div>
  );
};

export default LandingPage;