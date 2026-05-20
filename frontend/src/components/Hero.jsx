import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import ScrollExpandMedia from "@/components/ScrollExpandMedia";
import SplineScene from "@/components/SplineScene";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Optional: set to a valid Spline scene URL (https://prod.spline.design/.../scene.splinecode)
// to enable a 3D Spline scene behind the floating ghost. Leave null to use the
// transparent PNG only.
const SPLINE_GHOST_SCENE = null;

// Parchment background used during the scroll-expand intro
const BG_TEXTURE =
  "https://static.prod-images.emergentagent.com/jobs/cf313e6c-1ef6-480f-8538-031db3fc25ba/images/d5bcc511520c5ecc6d06df8778ccedbcb5f10598148cb9cd916acf028ab36eb9.png";

const TRANSPARENT_GHOST = "/ghost-transparent.png";

function FloatingGhost() {
  // Mouse-tracked floating transparent ghost — falls back if Spline fails
  const [splineFailed, setSplineFailed] = useState(false);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [-6, 6]);
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 0.95]);

  return (
    <div
      ref={ref}
      data-testid="floating-ghost"
      className="relative w-full h-[640px] md:h-[760px] flex items-center justify-center"
    >
      {/* Soft halo */}
      <div
        aria-hidden
        className="absolute w-[80%] aspect-square rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(163,177,155,0.35), rgba(163,177,155,0) 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-12 w-[40%] h-6 rounded-[50%] pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(60,40,20,0.25), rgba(60,40,20,0) 70%)",
          filter: "blur(12px)",
        }}
      />

      {/* Optional Spline scene behind the ghost — only renders when configured */}
      {SPLINE_GHOST_SCENE && !splineFailed ? (
        <div
          className="absolute inset-0 opacity-90"
          onError={() => setSplineFailed(true)}
        >
          <SplineScene
            scene={SPLINE_GHOST_SCENE}
            className="!w-full !h-full"
          />
        </div>
      ) : null}

      {/* Always-on transparent ghost overlay (primary visual) */}
      <motion.img
        src={TRANSPARENT_GHOST}
        alt="Lunet Labz ghost mascot"
        className="relative z-10 w-[300px] md:w-[440px] lg:w-[520px] select-none pointer-events-none"
        style={{ rotate, y, scale }}
        animate={{ y: [0, -16, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        draggable={false}
      />

      {/* Tiny floating tags */}
      <div className="absolute top-10 right-[10%] tag floaty hidden md:inline-flex">
        v0.1 · paranormal
      </div>
      <div
        className="absolute bottom-20 left-[10%] tag hidden md:inline-flex"
        style={{ animationDelay: "1.5s" }}
      >
        {"</>"} on the mouth
      </div>
    </div>
  );
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
      className="mt-12 max-w-md mx-auto flex flex-col sm:flex-row gap-3 sm:items-end"
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

export default function Hero() {
  return (
    <div id="top" data-testid="hero">
      {/* Stage 1 — Scroll Expand intro */}
      <ScrollExpandMedia
        mediaSrc={TRANSPARENT_GHOST}
        bgImageSrc={BG_TEXTURE}
        title="Lunet Labz"
        scrollToExpand="Scroll to enter"
      >
        <div className="text-center max-w-2xl mx-auto">
          <p className="section-eyebrow mb-5 inline-flex justify-center">
            <span className="font-mono">{"</> "}</span>
            A small studio of curious apps
          </p>
          <h2 className="font-serif text-5xl md:text-7xl italic tracking-tight leading-[1]">
            Tiny apps,
            <br />
            <span className="text-[var(--terracotta)]">big whispers.</span>
          </h2>
          <p className="mt-8 text-lg text-[var(--ink-soft)] leading-relaxed">
            A quiet collective shipping handcrafted tools, web toys and small
            utilities. No subscriptions. No popups. Just things we wish existed.
          </p>
          <WaitlistForm />
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[var(--ink-soft)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--sage)] animate-pulse" />
            No spam. Unsubscribe with a single sigh.
          </div>
        </div>
      </ScrollExpandMedia>

      {/* Stage 2 — Spline / transparent ghost transition */}
      <section
        data-testid="ghost-stage"
        className="relative py-20 md:py-28 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 lg:pr-6">
            <p className="section-eyebrow mb-5">
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
            <p className="mt-6 text-[var(--ink-soft)] leading-relaxed max-w-md">
              A small ceramic ghost lives in our servers. He pushes commits at
              3am, sweeps up bugs, and brews coffee while you sleep. Say hello
              — he is usually around.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="btn-pill"
                data-testid="see-projects-btn"
              >
                See the projects
                <span className="font-mono text-[11px] opacity-70">{"→"}</span>
              </a>
              <a
                href="#coffee"
                className="btn-pill ghost"
                data-testid="see-coffee-btn"
              >
                Pour us a coffee
              </a>
            </div>
          </div>
          <div className="lg:col-span-7">
            <FloatingGhost />
          </div>
        </div>
      </section>
    </div>
  );
}
