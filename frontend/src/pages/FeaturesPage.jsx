import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Feather,
  Moon,
  Sprout,
  Wand2,
  Coffee as CoffeeIcon,
  ShieldOff,
  Heart,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PRINCIPLES = [
  {
    icon: Feather,
    title: "Light by design.",
    body: "Every app under 200kb where possible. Pages load before you finish blinking.",
  },
  {
    icon: Moon,
    title: "Made for late nights.",
    body: "Calm color palettes, gentle motion, and absolutely zero pop-ups.",
  },
  {
    icon: Sprout,
    title: "Grown, not scaled.",
    body: "Projects stay small enough to love. If something stops feeling right, we put it back on the shelf.",
  },
  {
    icon: Wand2,
    title: "A little bit of magic.",
    body: "Each app hides a small flourish — a hidden command, a tiny easter egg, a beautiful loading state.",
  },
  {
    icon: ShieldOff,
    title: "No trackers, no telemetry.",
    body: "We don't watch what you do. Privacy is a side effect of caring.",
  },
  {
    icon: Heart,
    title: "Free forever.",
    body: "No subscriptions. No paywalls. If you'd like to support us, you can buy us a slow coffee.",
  },
  {
    icon: Sparkles,
    title: "Crafted, not generated.",
    body: "We use AI as a brush, not the painter. Every line is read before it ships.",
  },
  {
    icon: CoffeeIcon,
    title: "Open to whispers.",
    body: "Got a wild idea? Found a bug? Tell us. We read everything, even the rambly ones.",
  },
];

export default function FeaturesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main data-testid="features-page" className="relative">
      <Navbar />

      <section className="pt-36 md:pt-44 pb-16">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] mb-10"
            data-testid="features-back-link"
          >
            <ArrowLeft size={14} /> Back home
          </Link>

          <p className="section-eyebrow mb-4">— What we believe</p>
          <h1 className="headline-serif text-6xl md:text-8xl lg:text-[9rem] leading-[0.95]">
            Software that
            <br />
            <span className="italic text-[var(--terracotta)]">
              behaves itself.
            </span>
          </h1>
          <p className="mt-8 max-w-xl text-[var(--ink-soft)] text-lg leading-relaxed">
            A small manifesto for the things we make. We don't always get it
            right — but we try, slowly, on purpose.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-[var(--bg-alt)]/40 border-y border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
            {PRINCIPLES.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  data-testid={`principle-${i}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: (i % 4) * 0.06 }}
                  className={i % 2 ? "md:mt-12" : ""}
                >
                  <div className="w-14 h-14 rounded-full border border-[var(--border)] bg-white/60 flex items-center justify-center mb-5">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-serif text-3xl md:text-4xl mb-2 tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-[var(--ink-soft)] leading-relaxed max-w-sm">
                    {p.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 md:px-10 text-center">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight">
            Curious?
          </h2>
          <p className="mt-4 text-[var(--ink-soft)] leading-relaxed">
            Step into the shelf and see what we've quietly made.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              to="/projects"
              className="btn-pill"
              data-testid="features-cta-projects"
            >
              See the projects →
            </Link>
            <Link
              to="/#waitlist"
              className="btn-pill ghost"
              data-testid="features-cta-waitlist"
            >
              Join the waitlist
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
