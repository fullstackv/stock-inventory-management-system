import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Boxes,
  Package,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  Users,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Menu,
  X,
  ArrowDownToLine,
  ArrowUpFromLine,
  Tags,
  Sparkles,
  Zap,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const features = [
  {
    icon: Package,
    title: "Spares Inventory",
    desc: "Organize every part with SKUs, categories, suppliers and reorder levels in one place.",
    from: "from-sky-500",
    to: "to-blue-600",
  },
  {
    icon: ArrowDownToLine,
    title: "Stock In",
    desc: "Log every delivery the moment it arrives and keep quantities accurate automatically.",
    from: "from-emerald-500",
    to: "to-teal-600",
  },
  {
    icon: ArrowUpFromLine,
    title: "Stock Out",
    desc: "Track what leaves your warehouse and the exact value it represents.",
    from: "from-rose-500",
    to: "to-pink-600",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    desc: "Trends, top movers and category breakdowns that turn raw data into decisions.",
    from: "from-violet-500",
    to: "to-purple-600",
  },
  {
    icon: Users,
    title: "Team Management",
    desc: "One owner account, unlimited store keepers, each with their own isolated inventory.",
    from: "from-amber-500",
    to: "to-orange-600",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Security",
    desc: "Owners administer accounts. Store keepers run day-to-day stock. Nothing overlaps.",
    from: "from-cyan-500",
    to: "to-sky-600",
  },
];

const steps = [
  {
    icon: Users,
    title: "Owner sets up the team",
    desc: "The business owner creates store keeper accounts in seconds, each starting on a shared, easy-to-share temporary password.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    ring: "ring-amber-500/20",
  },
  {
    icon: Boxes,
    title: "Store keepers run the floor",
    desc: "Each store keeper manages their own spares, categories, suppliers, and stock movements — completely isolated from others.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    ring: "ring-blue-500/20",
  },
  {
    icon: TrendingUp,
    title: "Everyone gets clarity",
    desc: "Live dashboards surface low-stock alerts, movement trends and account activity so nothing falls through the cracks.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-500/20",
  },
];

const testimonials = [
  {
    name: "John M.",
    role: "Warehouse Manager",
    text: "SIMS helped us cut stock discrepancies by more than 80%. Setup took an afternoon, not a month.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Sarah K.",
    role: "Inventory Officer",
    text: "The dashboard is clean and fast. I can track everything in real time without digging through spreadsheets.",
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    name: "David R.",
    role: "Business Owner",
    text: "Managing my store keepers' accounts and seeing an overview of the whole operation finally feels effortless.",
    color: "from-amber-500 to-orange-600",
  },
];

const stats = [
  { value: "99%", label: "Tracking Accuracy", color: "text-brand-400" },
  { value: "24/7", label: "System Availability", color: "text-emerald-400" },
  { value: "1", label: "Owner, Full Control", color: "text-sky-400" },
  { value: "∞", label: "Store Keepers Supported", color: "text-violet-400" },
];

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [contact, setContact] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    document.title = "SIMS - Stock Inventory Management, Elevated";
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contact.name || !contact.email || !contact.message) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Thanks! We'll get back to you soon.");
    setContact({ name: "", email: "", message: "" });
  };

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#dashboard", label: "Dashboard" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink-900 text-white">
      {/* Ambient color field - deliberately NOT all-orange: blue, violet and
          emerald blobs balance the brand color so the page reads as
          designed, not monochrome. */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute right-0 top-1/4 h-[24rem] w-[24rem] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[26rem] w-[26rem] rounded-full bg-brand-600/20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[20rem] w-[20rem] rounded-full bg-emerald-600/10 blur-[120px]" />
      </div>

      {/* NAV */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? "border-b border-white/10 bg-ink-900/80 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-red-500 shadow-glow">
              <Boxes size={18} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-widest">SIMS</span>
          </div>

          <div className="hidden items-center gap-8 text-sm font-medium text-white/60 md:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-white">
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link to="/login" className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10">
              Login
            </Link>
            <Link to="/login" className="btn-primary !py-2 !px-4 text-sm">
              Get Started <ArrowRight size={15} />
            </Link>
          </div>

          <button onClick={() => setMobileNavOpen((o) => !o)} className="rounded-lg p-2 text-white/70 hover:bg-white/10 md:hidden">
            {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10 bg-ink-900/95 px-6 py-4 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-3 text-sm text-white/70">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMobileNavOpen(false)} className="py-1">
                  {l.label}
                </a>
              ))}
              <div className="mt-2 flex gap-3">
                <Link to="/login" className="flex-1 rounded-xl border border-white/15 py-2.5 text-center text-sm font-medium">
                  Login
                </Link>
                <Link to="/login" className="btn-primary flex-1 !py-2.5 text-sm">
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative px-6 pb-24 pt-40 text-center md:pt-48">
        <motion.div initial="hidden" animate="show" variants={stagger} className="relative z-10 mx-auto max-w-4xl">
          <motion.div
            variants={fadeUp}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70"
          >
            <Sparkles size={13} className="text-brand-400" />
            Built for owners and store keepers, together
          </motion.div>

          <motion.h1 variants={fadeUp} className="font-display text-4xl font-bold leading-[1.1] md:text-6xl">
            Inventory management
            <br />
            <span className="bg-gradient-to-r from-brand-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
              with total clarity & control
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
            SIMS gives one owner full oversight and every store keeper their own isolated
            workspace — real-time stock tracking, smart alerts, and reports that actually
            help you make decisions.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap justify-center gap-4">
            <Link to="/login" className="btn-primary !px-6 !py-3 text-base">
              Get Started <ArrowRight size={18} />
            </Link>
            <a href="#features" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-base font-medium transition-colors hover:bg-white/10">
              Explore Features
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-white/50">
            {[
              { icon: Zap, label: "Real-time tracking" },
              { icon: Lock, label: "Role-based access" },
              { icon: CheckCircle2, label: "Built-in low-stock alerts" },
              { icon: BarChart3, label: "Visual analytics" },
            ].map((item) => (
              <span key={item.label} className="flex items-center gap-2">
                <item.icon size={15} className="text-brand-400" /> {item.label}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm md:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <p className={`font-display text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="mt-1 text-xs text-white/50">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-6 py-24 md:px-10">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="mx-auto max-w-2xl text-center">
          <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest text-brand-400">Features</motion.p>
          <motion.h2 variants={fadeUp} className="mt-2 font-display text-3xl font-bold md:text-4xl">Everything your stockroom needs</motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-white/50">
            One system, two roles, zero guesswork.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
            >
              <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.from} ${f.to} shadow-lg`}>
                <f.icon size={20} className="text-white" />
              </div>
              <h3 className="font-display font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-y border-white/10 bg-white/[0.02] px-6 py-24 md:px-10">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="mx-auto max-w-2xl text-center">
          <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest text-emerald-400">How it works</motion.p>
          <motion.h2 variants={fadeUp} className="mt-2 font-display text-3xl font-bold md:text-4xl">Two roles. One clear workflow.</motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3"
        >
          {steps.map((s, i) => (
            <motion.div key={s.title} variants={fadeUp} className="relative rounded-2xl border border-white/10 bg-ink-900/60 p-6">
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${s.bg} ring-1 ${s.ring}`}>
                <s.icon size={22} className={s.color} />
              </div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-white/30">Step {i + 1}</p>
              <h3 className="font-display font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section id="dashboard" className="px-6 py-24 md:px-10">
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mb-14 text-center font-display text-3xl font-bold md:text-4xl"
        >
          A dashboard that actually helps
        </motion.h2>

        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55 }}
            className="relative"
          >
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-brand-500/15 via-violet-500/10 to-sky-500/15 blur-2xl" />
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-md">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white/80">Live System Preview</h3>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Stock", value: "1,248", accent: "text-white" },
                  { label: "Stock In", value: "+320", accent: "text-emerald-400" },
                  { label: "Stock Out", value: "-210", accent: "text-rose-400" },
                  { label: "Accuracy", value: "99%", accent: "text-brand-400" },
                ].map((k) => (
                  <div key={k.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                    <p className="text-[11px] text-white/40">{k.label}</p>
                    <p className={`mt-1 text-lg font-bold font-display ${k.accent}`}>{k.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-end gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                {[40, 65, 45, 80, 55, 90, 70, 60, 85, 50, 95, 75].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-brand-600 to-orange-400" style={{ height: `${h}px`, opacity: 0.55 + (h / 200) }} />
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="mb-2 text-xs font-semibold text-white/60">Recent Activity</p>
                <div className="space-y-2 text-xs text-white/50">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><Package size={12} className="text-blue-400" /> Brake Pads</span>
                    <span className="text-emerald-400">+50 Stock In</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><Tags size={12} className="text-violet-400" /> Oil Filter</span>
                    <span className="text-rose-400">-20 Stock Out</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <h3 className="font-display text-2xl font-bold">Everything you need to manage inventory</h3>
            <p className="mt-4 leading-relaxed text-white/50">
              From tracking stock in real time to generating actionable reports, SIMS is
              designed for speed, accuracy, and simplicity — for owners overseeing the
              whole operation and store keepers running the floor.
            </p>

            <div className="mt-6 space-y-3.5 text-sm">
              {[
                { text: "Real-time stock tracking system", color: "text-blue-400" },
                { text: "Effortless stock in / stock out logging", color: "text-emerald-400" },
                { text: "Advanced reporting and analytics", color: "text-violet-400" },
                { text: "Secure, isolated role-based access", color: "text-amber-400" },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <CheckCircle2 size={17} className={`mt-0.5 shrink-0 ${item.color}`} />
                  <p className="text-white/70">{item.text}</p>
                </div>
              ))}
            </div>

            <Link to="/login" className="btn-primary mt-7 inline-flex !px-6 !py-3">
              Try the Dashboard <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="border-y border-white/10 bg-white/[0.02] px-6 py-24 md:px-10">
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mb-14 text-center font-display text-3xl font-bold md:text-4xl"
        >
          What people are saying
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={fadeUp} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm leading-relaxed text-white/70">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-sm font-bold text-white`}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-white/40">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA BANNER */}
      <section className="px-6 py-20 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55 }}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-800 p-10 text-center md:p-16"
        >
          <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-sky-500/15 blur-3xl" />
          <h2 className="relative font-display text-3xl font-bold md:text-4xl">Ready to take control of your inventory?</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-white/50">
            Log in to your SIMS account and get a clear, real-time view of your stock —
            wherever you are.
          </p>
          <Link to="/login" className="btn-primary relative mt-8 inline-flex !px-7 !py-3.5 text-base">
            Get Started <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="px-6 py-24 md:px-10">
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mb-14 text-center font-display text-3xl font-bold md:text-4xl"
        >
          Get in touch
        </motion.h2>

        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            {[
              { icon: Mail, label: "fullstackv@sims.com", color: "text-blue-400", bg: "bg-blue-500/10" },
              { icon: Phone, label: "+250 785 683 347", color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { icon: MapPin, label: "Kigali, Rwanda", color: "text-violet-400", bg: "bg-violet-500/10" },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-3.5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.bg}`}>
                  <c.icon size={17} className={c.color} />
                </div>
                <span className="text-sm text-white/70">{c.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.form
            onSubmit={handleContactSubmit}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <input
              value={contact.name}
              onChange={(e) => setContact({ ...contact, name: e.target.value })}
              placeholder="Your Name"
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-brand-400"
            />
            <input
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              placeholder="Your Email"
              type="email"
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-brand-400"
            />
            <textarea
              value={contact.message}
              onChange={(e) => setContact({ ...contact, message: e.target.value })}
              placeholder="Message"
              rows="4"
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-brand-400"
            />
            <button type="submit" className="btn-primary w-full !py-3">
              Send Message
            </button>
          </motion.form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black/30 px-6 py-12 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-red-500">
                <Boxes size={15} className="text-white" />
              </div>
              <h3 className="font-display text-lg font-bold">SIMS</h3>
            </div>
            <p className="mt-3 text-sm text-white/40">
              Stock Inventory Management System for modern businesses.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-white/80">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white/40">
              <li><a href="#features" className="hover:text-white/70">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white/70">How It Works</a></li>
              <li><a href="#contact" className="hover:text-white/70">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-white/80">System</h3>
            <ul className="space-y-2 text-sm text-white/40">
              <li><Link to="/login" className="hover:text-white/70">Login</Link></li>
            </ul>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-white/30">
          © {new Date().getFullYear()} SIMS. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;