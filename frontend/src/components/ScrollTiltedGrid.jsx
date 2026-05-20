import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  cubicBezier,
} from "framer-motion";

const easeIn = cubicBezier(0.22, 1, 0.36, 1);
const easeOut = cubicBezier(0, 0, 0.58, 1);
const FOCUS_EASE = [easeIn, easeOut];

function Tile({ src, side, config, label }) {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const reduce = useReducedMotion();
  const sign = side === "L" ? -1 : 1;
  const { aspectRatio, perspective, maxTilt, maxBlur, rounded } = config;

  const blur = useTransform(p, [0, 0.5, 1], [maxBlur, 0, maxBlur], { ease: FOCUS_EASE });
  const bright = useTransform(p, [0, 0.5, 1], [0.6, 1, 0.6], { ease: FOCUS_EASE });
  const contrast = useTransform(p, [0, 0.5, 1], [2.4, 1, 2.4], { ease: FOCUS_EASE });

  const ty = useTransform(p, [0, 0.5, 1], ["80%", "0%", "-80%"], { ease: FOCUS_EASE });
  const tz = useTransform(p, [0, 0.5, 1], [220, 0, 220], { ease: FOCUS_EASE });
  const rx = useTransform(p, [0, 0.5, 1], [maxTilt, 0, -maxTilt], { ease: FOCUS_EASE });

  const tx = useTransform(p, [0, 0.5, 1],
    [`${sign * 30}%`, "0%", `${sign * 30}%`], { ease: FOCUS_EASE });
  const rot = useTransform(p, [0, 0.5, 1], [-sign * 4, 0, sign * 4], { ease: FOCUS_EASE });
  const sk = useTransform(p, [0, 0.5, 1], [sign * 14, 0, -sign * 14], { ease: FOCUS_EASE });

  const innerSY = useTransform(p, [0, 0.5, 1], [1.5, 1, 1.5], { ease: FOCUS_EASE });
  const labelOp = useTransform(p, [0, 0.4, 0.6, 1], [0, 1, 1, 0]);

  const filter = useMotionTemplate`blur(${blur}px) brightness(${bright}) contrast(${contrast})`;

  if (reduce) {
    return (
      <figure ref={ref} className="relative z-10 m-0">
        <div
          className="relative w-full overflow-hidden card-paper"
          style={{ aspectRatio, borderRadius: rounded }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${src}")` }}
          />
        </div>
        {label && (
          <figcaption className="mt-3 font-serif text-2xl text-[var(--ink)]">
            {label}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <motion.figure
      ref={ref}
      className="relative z-10 m-0"
      style={{ perspective, willChange: "transform" }}
    >
      <motion.div
        className="relative w-full overflow-hidden will-change-[filter,transform] border border-[var(--border)]"
        style={{
          aspectRatio,
          borderRadius: rounded,
          filter,
          x: tx,
          y: ty,
          z: tz,
          rotate: rot,
          rotateX: rx,
          skewX: sk,
        }}
      >
        <motion.div
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{
            backgroundImage: `url("${src}")`,
            scaleY: innerSY,
            backfaceVisibility: "hidden",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,26,26,0.35)] via-transparent to-transparent" />
      </motion.div>
      {label && (
        <motion.figcaption
          className="mt-4 font-serif italic text-2xl md:text-3xl text-[var(--ink)] tracking-tight"
          style={{ opacity: labelOp }}
        >
          {label}
        </motion.figcaption>
      )}
    </motion.figure>
  );
}

const MAX_WIDTH_CLASS = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  none: "",
};
const GAP_CLASS = {
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
  14: "gap-14",
};

export default function ScrollTiltedGrid({
  items = [],
  loop = false,
  initialCycles = 2,
  aspectRatio = "3/4",
  maxWidth = "3xl",
  gap = 12,
  perspective = 900,
  maxTilt = 55,
  maxBlur = 6,
  rounded = "1rem",
  className,
}) {
  const [cycles, setCycles] = useState(loop ? initialCycles : 1);
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!loop) return;
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setCycles((c) => c + 2);
        }
      },
      { rootMargin: "1500px 0px 1500px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loop]);

  const renderItems = useMemo(
    () =>
      loop
        ? Array.from({ length: cycles }, () => items).flat()
        : [...items],
    [loop, cycles, items]
  );

  const config = useMemo(
    () => ({ aspectRatio, perspective, maxTilt, maxBlur, rounded }),
    [aspectRatio, perspective, maxTilt, maxBlur, rounded]
  );

  const gridClass = [
    "mx-auto mt-[10vh] mb-[6vh] grid w-full grid-cols-1 md:grid-cols-2 px-6 py-[14vh]",
    MAX_WIDTH_CLASS[maxWidth],
    GAP_CLASS[gap],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      data-testid="scroll-tilted-grid"
      className={["relative w-full", className].filter(Boolean).join(" ")}
    >
      <div className={gridClass}>
        {renderItems.map((it, i) => (
          <Tile
            key={`${i}-${it.src}`}
            src={it.src}
            label={it.label}
            side={i % 2 === 0 ? "L" : "R"}
            config={config}
          />
        ))}
      </div>
      {loop ? (
        <div ref={sentinelRef} aria-hidden className="h-px w-full" />
      ) : null}
    </section>
  );
}
