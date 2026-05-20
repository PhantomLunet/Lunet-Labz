import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Projects", to: "/projects" },
    { label: "Features", to: "/features" },
    { label: "How it works", to: isHome ? "#how" : "/#how", hash: true },
    { label: "Support", to: isHome ? "#coffee" : "/#coffee", hash: true },
  ];

  return (
    <motion.nav
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${
        scrolled || !isHome ? "nav-glass py-3" : "py-6"
      }`}
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        <Link to="/" data-testid="logo" className="flex items-center gap-2 group">
          <span
            className="font-serif text-2xl tracking-tight"
            style={{ fontStyle: "italic" }}
          >
            Lunet
          </span>
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--ink-soft)] border border-[var(--border)] rounded-full px-2 py-0.5">
            Labz
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) =>
            l.hash ? (
              <a
                key={l.label}
                href={l.to}
                data-testid={`nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.label}
                to={l.to}
                data-testid={`nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
              >
                {l.label}
              </Link>
            )
          )}
        </div>
        {isHome ? (
          <a href="#waitlist" className="btn-pill" data-testid="nav-join-waitlist">
            Join waitlist
            <span className="font-mono text-[11px] opacity-70">{"→"}</span>
          </a>
        ) : (
          <Link to="/" className="btn-pill" data-testid="nav-home">
            Home
            <span className="font-mono text-[11px] opacity-70">{"→"}</span>
          </Link>
        )}
      </div>
    </motion.nav>
  );
}
