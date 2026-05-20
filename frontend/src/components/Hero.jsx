import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import Ghost3D from "@/components/Ghost3D";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Hero() {
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = e.clientX / window.innerWidth;
      mouse.current.y = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await axios.post(`${API}/waitlist`, { email });
      toast.success("You're on the list. We'll send a quiet hello soon.");
      setEmail("");
    } catch (err) {
      const detail = err?.response?.data?.detail;
      toast.error(detail || "Something drifted off. Try again?");
    } finally {
      setLoading(false);
    }
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  };
  const item = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.2, 0.7, 0.2, 1] } },
  };

  return (
    <section
      id="top"
      data-testid="hero"
      className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden"
    >
      {/* Ambient blob */}
      <div
        aria-hidden
        className="absolute top-1/3 -right-40 w-[640px] h-[640px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(163,177,155,0.35), rgba(163,177,155,0) 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 -left-40 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(194,123,102,0.22), rgba(194,123,102,0) 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center w-full">
        {/* Left — copy */}
        <motion.div
          className="lg:col-span-6 lg:pr-8"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="section-eyebrow mb-6">
            <span className="font-mono">{"</> "}</span>
            Lunet Labz — A small studio of curious apps
          </motion.div>

          <motion.h1
            variants={item}
            className="headline-serif text-[64px] sm:text-[88px] lg:text-[112px]"
            data-testid="hero-title"
          >
            Tiny apps,
            <br />
            <span className="text-[var(--terracotta)]">big{" "}</span>
            <span className="italic">whispers.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-8 text-lg text-[var(--ink-soft)] max-w-md leading-relaxed"
          >
            A quiet collective shipping handcrafted tools, web toys and small
            utilities. No subscriptions. No popups. Just things we wish existed.
          </motion.p>

          <motion.form
            variants={item}
            onSubmit={submit}
            id="waitlist"
            className="mt-10 max-w-md flex flex-col sm:flex-row gap-3 sm:items-end"
            data-testid="waitlist-form"
          >
            <div className="flex-1">
              <label className="section-eyebrow block mb-2">
                Get a note when we ship
              </label>
              <input
                type="email"
                required
                placeholder="you@somewhere.lovely"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-underline"
                data-testid="waitlist-email-input"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-pill"
              data-testid="waitlist-submit"
            >
              {loading ? "Sending…" : "Join waitlist"}
              <span className="font-mono text-[11px] opacity-70">{"→"}</span>
            </button>
          </motion.form>

          <motion.div
            variants={item}
            className="mt-8 flex items-center gap-3 text-xs text-[var(--ink-soft)]"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--sage)] animate-pulse" />
              No spam. Unsubscribe with a single sigh.
            </span>
          </motion.div>
        </motion.div>

        {/* Right — 3D ghost */}
        <motion.div
          className="lg:col-span-6 relative h-[420px] sm:h-[520px] lg:h-[640px]"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1] }}
          data-testid="hero-ghost-canvas"
        >
          <Ghost3D mouse={mouse} />
          {/* Floating tag */}
          <div className="absolute top-6 right-2 sm:right-10 tag floaty">
            v0.1 · paranormal
          </div>
          <div
            className="absolute bottom-10 left-2 sm:left-10 tag"
            style={{ animationDelay: "1.5s" }}
          >
            {"</>"}  on the mouth
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--ink-soft)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
      >
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase">
          scroll
        </span>
        <motion.div
          className="w-px h-10 bg-[var(--ink-soft)]"
          animate={{ scaleY: [0.3, 1, 0.3], originY: 0 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
