import { Suspense, lazy } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

export default function SplineScene({ scene, className, onLoad }) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex items-center gap-3 font-mono text-xs tracking-[0.3em] uppercase text-[var(--ink-soft)]">
            <span className="w-2 h-2 rounded-full bg-[var(--terracotta)] animate-pulse" />
            Summoning ghost
          </div>
        </div>
      }
    >
      <Spline scene={scene} className={className} onLoad={onLoad} />
    </Suspense>
  );
}
