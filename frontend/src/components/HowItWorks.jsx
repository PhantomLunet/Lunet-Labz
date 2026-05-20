import { motion } from "framer-motion";

const STEPS = [
  {
    n: "01",
    title: "Find a project.",
    body:
      "Browse the shelf above. Each card opens directly into a live web app, a download, or its source code.",
  },
  {
    n: "02",
    title: "Use it freely.",
    body:
      "No accounts, no telemetry, no ads. Take what's useful, ignore the rest. Bring it home.",
  },
  {
    n: "03",
    title: "Send us a note.",
    body:
      "Found a bug? Got a wild idea? Drop us a line — or pour us a coffee. We read everything.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      data-testid="how-section"
      className="relative py-28 md:py-40"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9 }}
          className="mb-20 max-w-2xl"
        >
          <p className="section-eyebrow mb-4">— 03 / How it works</p>
          <h2 className="font-serif text-5xl md:text-7xl tracking-tight leading-[1]">
            Three quiet steps,
            <br />
            <span className="italic text-[var(--ink-soft)]">and you're in.</span>
          </h2>
        </motion.div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Decorative line */}
          <div
            aria-hidden
            className="hidden md:block absolute top-10 left-[8%] right-[8%] h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, var(--border), transparent)",
            }}
          />

          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              data-testid={`step-${i}`}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.12 }}
            >
              <div className="relative z-10 w-20 h-20 rounded-full bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center mb-8 mx-auto md:mx-0">
                <span className="font-serif text-2xl italic">{s.n}</span>
              </div>
              <h3 className="font-serif text-3xl tracking-tight mb-3">
                {s.title}
              </h3>
              <p className="text-[var(--ink-soft)] leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
