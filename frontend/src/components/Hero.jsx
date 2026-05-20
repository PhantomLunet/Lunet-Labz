import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const GHOST = "/ghost-transparent.png";

/* ── Interpolation helper ───────────────────────────────────────────────
 * Multi-point linear interpolation that clamps at both ends. Avoids
 * framer-motion's `useTransform → style` motion-value chain (which was
 * not propagating to the DOM in React 19 + fm v12).
 */
function lerpRange(t, stops, values) {
  if (t <= stops[0]) return values[0];
  if (t >= stops[stops.length - 1]) return values[values.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i] && t <= stops[i + 1]) {
      const span = stops[i + 1] - stops[i];
      const u = span === 0 ? 0 : (t - stops[i]) / span;
      return values[i] + (values[i + 1] - values[i]) * u;
    }
  }
  return values[values.length - 1];
}

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <form
      id="waitlist"
      onSubmit={submit}
      data-testid="waitlist-form"
      className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-3 sm:items-end"
    >
      <div className="flex-1">
        <label className="section-eyebrow block mb-2 text-left">
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
    </form>
  );
}

/**
 * Pinned scroll hero with three phases.
 *
 * Phase A (0 → 0.35): "Lunet" + "Labz" slide IN from far-left / far-right.
 *                     They settle on either side of the ghost AT THE SAME HEIGHT.
 *                     They never cross the ghost.
 * Phase B (0.35 → 0.55): Hold. Subtitle + waitlist fade in below the title.
 * Phase C (0.55 → 1.0): The ghost performs a flip (rotateY 360°), shrinks &
 *                     drifts up-left into the "Meet the Mascot" composition.
 *                     The Lunet/Labz wordmark + subtitle fade out as the
 *                     mascot copy fades in. Ghost opacity is reduced so it
 *                     visually sits BEHIND the mascot text (no shadow).
 */
export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [p, setP] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setP(v));

  // ── Title positions (Phase A) ──────────────────────────────────────
  const lunetX = lerpRange(p, [0, 0.3, 1], [-65, -26, -26]);
  const labzX = lerpRange(p, [0, 0.3, 1], [65, 26, 26]);
  // Tight fade-out so Lunet/Labz fully clear BEFORE mascot copy crosses in
  const titleOpacity = lerpRange(p, [0, 0.05, 0.5, 0.6], [0, 1, 1, 0]);
  const titleScale = lerpRange(p, [0, 0.3, 0.55, 0.6], [0.6, 1, 1, 0.85]);

  // ── Ghost transforms ──────────────────────────────────────────────
  const ghostXvw = lerpRange(p, [0, 0.6, 1], [0, 0, -18]);
  const ghostYvh = lerpRange(p, [0, 0.6, 1], [0, 0, -4]);
  const ghostRotateY = lerpRange(p, [0, 0.6, 1], [0, 0, 360]);
  const ghostScale = lerpRange(p, [0, 0.6, 0.8, 1], [1, 1, 0.78, 0.95]);
  const ghostOpacity = lerpRange(p, [0, 0.6, 0.8, 1], [1, 1, 0.7, 0.55]);

  // ── Mascot copy (begins after title is fully gone) ─────────────────
  const mascotOpacity = lerpRange(p, [0, 0.6, 0.78, 1], [0, 0, 1, 1]);
  const mascotXvw = lerpRange(p, [0, 0.6, 1], [6, 6, 0]);

  // ── Subtitle / waitlist (Phase B — wider dwell so it's actually interactable) ─
  const subtitleOpacity = lerpRange(
    p,
    [0, 0.18, 0.3, 0.5, 0.58],
    [0, 0, 1, 1, 0]
  );

  // ── Ambient warm radial ───────────────────────────────────────────
  const ambientWarmth = lerpRange(p, [0, 0.5, 1], [0.18, 0.18, 0.32]);

  // ── Scroll hint (Phase A only) ────────────────────────────────────
  const scrollHintOpacity = lerpRange(p, [0, 0.05, 0.25], [0, 1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      data-testid="hero"
      className="relative"
      style={{ height: "300vh" }}
    >
      <div
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center"
        data-testid="hero-stage"
      >
        {/* Ambient backdrop */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 30% 50%, rgba(194,123,102,${ambientWarmth}), transparent 60%)`,
          }}
        />

        {/* Soft halo behind ghost */}
        <div
          aria-hidden
          className="absolute w-[70vmin] aspect-square rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(closest-side, rgba(163,177,155,0.30), rgba(163,177,155,0) 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* ─── LAYER 1 (z-30): Mascot copy — Phase C ─── */}
        <div
          data-testid="mascot-copy"
          className="absolute z-30 left-[6vw] md:left-[8vw] top-1/2 max-w-md md:max-w-lg pointer-events-none"
          style={{
            opacity: mascotOpacity,
            transform: `translate(${mascotXvw}vw, -50%)`,
          }}
        >
          <p className="section-eyebrow mb-4">
            <span className="font-mono">{"</> "}</span>
            Meet the mascot
          </p>
          <h2 className="headline-serif text-5xl md:text-6xl lg:text-7xl">
            He runs the
            <br />
            <span className="italic text-[var(--terracotta)]">
              deploy button.
            </span>
          </h2>
          <p className="mt-5 text-[var(--ink-soft)] leading-relaxed max-w-md text-base md:text-lg">
            A small ceramic ghost lives in our servers. He pushes commits at
            3am, sweeps up bugs, and brews coffee while you sleep.
          </p>
          <div
            className="mt-7 flex flex-wrap gap-3"
            style={{ pointerEvents: mascotOpacity > 0.5 ? "auto" : "none" }}
          >
            <a
              href="#projects"
              className="btn-pill"
              data-testid="hero-see-projects"
            >
              See the projects
              <span className="font-mono text-[11px] opacity-70">{"→"}</span>
            </a>
            <a
              href="#coffee"
              className="btn-pill ghost"
              data-testid="hero-see-coffee"
            >
              Pour us a coffee
            </a>
          </div>
        </div>

        {/* ─── LAYER 2 (z-10): The Ghost — flips/shrinks in Phase C ─── */}
        <div
          className="relative z-10 flex items-center justify-center"
          style={{
            transform: `translate(${ghostXvw}vw, ${ghostYvh}vh) scale(${ghostScale})`,
            opacity: ghostOpacity,
            perspective: "1200px",
            transformStyle: "preserve-3d",
            transition: "opacity 0.1s linear",
          }}
        >
          <motion.img
            src={GHOST}
            alt="Lunet Labz ghost mascot"
            className="w-[44vmin] md:w-[40vmin] lg:w-[38vmin] select-none pointer-events-none"
            style={{
              transform: `rotateY(${ghostRotateY}deg)`,
              filter: "drop-shadow(0 30px 60px rgba(60,40,20,0.18))",
              backfaceVisibility: "visible",
            }}
            draggable={false}
            data-testid="hero-ghost"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* ─── LAYER 3 (z-20): Lunet / Labz on the sides ─── */}
        <h1
          className="absolute z-20 headline-serif text-[18vmin] md:text-[16vmin] leading-none text-[var(--ink)] select-none pointer-events-none"
          style={{
            opacity: titleOpacity,
            transform: `translateX(${lunetX}vw) scale(${titleScale})`,
          }}
          data-testid="hero-title-lunet"
        >
          Lunet
        </h1>
        <h1
          className="absolute z-20 headline-serif text-[18vmin] md:text-[16vmin] leading-none italic text-[var(--terracotta)] select-none pointer-events-none"
          style={{
            opacity: titleOpacity,
            transform: `translateX(${labzX}vw) scale(${titleScale})`,
          }}
          data-testid="hero-title-labz"
        >
          Labz
        </h1>

        {/* ─── Scroll hint — Phase A only ─── */}
        <div
          className="absolute z-30 bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          style={{ opacity: scrollHintOpacity }}
        >
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--ink-soft)]">
            scroll to enter
          </span>
          <motion.div
            className="w-px h-10 bg-[var(--ink-soft)]"
            animate={{ scaleY: [0.3, 1, 0.3] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            style={{ originY: 0 }}
          />
        </div>

        {/* ─── Subtitle + Waitlist — Phase B ─── */}
        <div
          className="absolute z-30 bottom-[8vh] left-1/2 -translate-x-1/2 text-center w-full max-w-2xl px-6"
          style={{
            opacity: subtitleOpacity,
            pointerEvents: subtitleOpacity > 0.5 ? "auto" : "none",
          }}
        >
          <p className="text-[var(--ink-soft)] text-base md:text-lg leading-relaxed">
            A small studio shipping handcrafted tools, web toys and tiny
            utilities. No subscriptions. Just things we wish existed.
          </p>
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}
