import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ExternalLink, Download, Github } from "lucide-react";
import ScrollTiltedGrid from "@/components/ScrollTiltedGrid";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function ProjectActions({ project }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {project.web_url && (
        <a
          href={project.web_url}
          target="_blank"
          rel="noreferrer"
          className="btn-pill"
          data-testid={`open-web-${project.id}`}
        >
          <ExternalLink size={14} />
          Open web app
        </a>
      )}
      {project.download_url && (
        <a
          href={project.download_url}
          target="_blank"
          rel="noreferrer"
          className="btn-pill terra"
          data-testid={`download-${project.id}`}
        >
          <Download size={14} />
          Download
        </a>
      )}
      {project.github_url && (
        <a
          href={project.github_url}
          target="_blank"
          rel="noreferrer"
          className="btn-pill ghost"
          data-testid={`github-${project.id}`}
        >
          <Github size={14} />
          Source
        </a>
      )}
    </div>
  );
}

function ProjectListItem({ project, idx }) {
  return (
    <motion.li
      data-testid={`project-card-${project.id}`}
      className="card-paper p-6 md:p-7 flex flex-col md:flex-row gap-5 md:items-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (idx % 6) * 0.05 }}
    >
      <div className="md:w-44 md:flex-shrink-0">
        <img
          src={project.image}
          alt={project.title}
          className="w-full aspect-[4/3] md:aspect-square object-cover rounded-xl border border-[var(--border)]"
          loading="lazy"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <h3 className="font-serif text-3xl md:text-4xl tracking-tight">
            {project.title}
          </h3>
          <div className="flex gap-1.5 flex-wrap">
            {project.tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
        </div>
        <p className="mt-2 text-[var(--ink-soft)] text-[15px] leading-relaxed">
          {project.tagline}
        </p>
        <p className="text-sm text-[var(--ink-soft)]/80 leading-relaxed mt-1">
          {project.description}
        </p>
        <ProjectActions project={project} />
      </div>
    </motion.li>
  );
}

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

  // For the tilted grid — pair each project image with its title
  const tilesItems = projects.map((p) => ({
    src: p.image,
    label: p.title,
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
          className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8"
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
              — like rooms in a small museum.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Cinematic scroll-tilted reel */}
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

      {/* Action shelf — each project with its real links */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <p className="section-eyebrow mb-3">Open the shelf</p>
          <h3 className="font-serif text-3xl md:text-4xl tracking-tight">
            Pick one up, take it home.
          </h3>
        </motion.div>

        {loading ? (
          <div
            data-testid="projects-loading"
            className="text-center text-[var(--ink-soft)] py-16 font-mono text-xs"
          >
            Summoning projects…
          </div>
        ) : (
          <ul className="flex flex-col gap-5">
            {projects.map((p, i) => (
              <ProjectListItem key={p.id} project={p} idx={i} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
