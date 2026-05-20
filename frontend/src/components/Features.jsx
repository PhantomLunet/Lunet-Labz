import { motion } from "framer-motion";
import { Feather, Moon, Sprout, Wand2 } from "lucide-react";

const FEATURES = [
  {
    icon: Feather,
    title: "Light by design.",
    body:
      "Every app under 200kb where possible. Pages load before you finish blinking. Quiet UI, slow animations, fast bytes.",
  },
  {
    icon: Moon,
    title: "Made for late nights.",
    body:
      "Built by a couple of moths who code best after midnight. Calm color palettes, gentle motion, and absolutely zero pop-ups.",
  },
  {
    icon: Sprout,
    title: "Grown, not scaled.",
    body:
      "We don't chase growth. Projects stay small enough to love. If something stops feeling right, we put it back on the shelf.",
  },
  {
    icon: Wand2,
    title: "A little bit of magic.",
    body:
      "Each app hides a small flourish — a hidden command, a tiny easter egg, a beautiful loading state. Curiosity rewarded.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      data-testid="features-section"
      className="relative py-28 md:py-40 bg-[var(--bg-alt)]/40"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p className="section-eyebrow mb-4">— 02 / What we believe</p>
          <h2 className="font-serif text-5xl md:text-7xl tracking-tight leading-[1]">
            Software that
            <br />
            <span className="italic text-[var(--terracotta)]">behaves itself.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                data-testid={`feature-${i}`}
                className={`relative ${i % 2 ? "md:mt-24" : ""}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, delay: i * 0.08 }}
              >
                <div className="w-14 h-14 rounded-full border border-[var(--border)] bg-white/50 flex items-center justify-center mb-6">
                  <Icon size={20} className="text-[var(--ink)]" />
                </div>
                <h3 className="font-serif text-3xl md:text-4xl mb-3 tracking-tight">
                  {f.title}
                </h3>
                <p className="text-[var(--ink-soft)] leading-relaxed max-w-sm">
                  {f.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
