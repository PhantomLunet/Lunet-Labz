import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import ScrollTiltedGrid from "@/components/ScrollTiltedGrid";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/projects`)
      .then((r) => setProjects(r.data))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const tilesItems = projects.map((p) => ({
    src: p.image,
    label: p.title,
    href: `/projects/${p.id}`,
  }));

  return (
    <section
      id="projects"
      data-testid="projects-section"
      className="relative py-20 md:py-28"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10"
        >
          <div className="md:col-span-7">
            <p className="section-eyebrow mb-4">— 01 / Projects</p>
            <h2 className="font-serif text-5xl md:text-7xl leading-[1] tracking-tight">
              Small things,
              <br />
              <span className="italic text-[var(--ink-soft)]">
                made with care.
              </span>
            </h2>
          </div>
          <div className="md:col-span-5 md:pt-10">
            <p className="text-[var(--ink-soft)] leading-relaxed">
              Scroll slowly. Each one rises into focus, lingers, and slips away
              — like rooms in a small museum. Click any tile to step inside.
            </p>
          </div>
        </motion.div>

        {/* Show all projects CTA — above the tilted grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="flex items-center justify-between border-t border-b border-[var(--border)] py-5"
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--ink-soft)]">
              {projects.length} projects on the shelf
            </span>
          </div>
          <Link
            to="/projects"
            className="btn-pill"
            data-testid="show-all-projects-btn"
          >
            Show all projects
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>

      {!loading && tilesItems.length > 0 && (
        <ScrollTiltedGrid
          items={tilesItems}
          aspectRatio="3/4"
          maxWidth="3xl"
          gap={12}
          perspective={900}
          maxTilt={55}
          maxBlur={6}
          rounded="1rem"
        />
      )}

      {loading && (
        <div
          data-testid="projects-loading"
          className="text-center text-[var(--ink-soft)] py-16 font-mono text-xs"
        >
          Summoning projects…
        </div>
      )}
    </section>
  );
}
