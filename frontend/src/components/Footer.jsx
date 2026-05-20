import { motion } from "framer-motion";

const MARQUEE = [
  "Lunet Labz",
  "</> ",
  "Made slowly",
  "</> ",
  "Open the apps",
  "</> ",
  "Stay curious",
  "</> ",
  "Boo.",
  "</> ",
];

export default function Footer() {
  return (
    <footer
      data-testid="footer"
      className="relative border-t border-[var(--border)] pt-16 pb-10 overflow-hidden"
    >
      {/* Marquee */}
      <div className="overflow-hidden border-b border-[var(--border)] pb-10 mb-12">
        <motion.div className="flex gap-12 whitespace-nowrap marquee-track will-change-transform">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((t, i) => (
            <span
              key={i}
              className="font-serif italic text-5xl md:text-7xl text-[var(--ink)]"
            >
              {t}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="font-serif text-3xl tracking-tight"
              style={{ fontStyle: "italic" }}
            >
              Lunet Labz
            </span>
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--ink-soft)] border border-[var(--border)] rounded-full px-2 py-0.5">
              {"</>"}
            </span>
          </div>
          <p className="text-[var(--ink-soft)] max-w-sm leading-relaxed">
            A small studio of curious apps, lovingly hosted by ghosts.
            <br /> Built with care from a corner of the internet.
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="section-eyebrow mb-4">Explore</p>
          <ul className="space-y-2 text-[var(--ink-soft)]">
            <li>
              <a href="#projects" className="hover:text-[var(--ink)]">
                Projects
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-[var(--ink)]">
                What we believe
              </a>
            </li>
            <li>
              <a href="#how" className="hover:text-[var(--ink)]">
                How it works
              </a>
            </li>
            <li>
              <a href="#coffee" className="hover:text-[var(--ink)]">
                Buy us a coffee
              </a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="section-eyebrow mb-4">Whisper to us</p>
          <ul className="space-y-2 text-[var(--ink-soft)]">
            <li>
              <a
                href="mailto:hello@lunet.labz"
                className="hover:text-[var(--ink)]"
                data-testid="footer-email"
              >
                hello@lunet.labz
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[var(--ink)]">
                GitHub
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[var(--ink)]">
                Are.na
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 mt-12 pt-6 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--ink-soft)] font-mono uppercase tracking-[0.18em]">
        <span>© {new Date().getFullYear()} Lunet Labz</span>
        <span>Handmade · No subscriptions · Ghosts approved</span>
      </div>
    </footer>
  );
}
