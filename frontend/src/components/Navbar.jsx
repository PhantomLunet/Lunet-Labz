import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 80], [0, 1]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Projects", href: "#projects" },
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how" },
    { label: "Support", href: "#coffee" },
  ];

  return (
    <motion.nav
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "nav-glass py-3" : "py-6"
      }`}
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        <a
          href="#top"
          data-testid="logo"
          className="flex items-center gap-2 group"
        >
          <span className="font-serif text-2xl tracking-tight" style={{ fontStyle: "italic" }}>
            Lunet
          </span>
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--ink-soft)] border border-[var(--border)] rounded-full px-2 py-0.5">
            Labz
          </span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
        <a
          href="#waitlist"
          className="btn-pill"
          data-testid="nav-join-waitlist"
        >
          Join waitlist
          <span className="font-mono text-[11px] opacity-70">{"→"}</span>
        </a>
      </div>
    </motion.nav>
  );
}
