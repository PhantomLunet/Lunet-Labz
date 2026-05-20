import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ExternalLink, Download, Github } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function ProjectCard({ project, large = false }) {
  return (
    <motion.article
      data-testid={`project-card-${project.id}`}
      className="card-paper relative flex flex-col h-full"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <div
        className={`relative overflow-hidden bg-[var(--bg-alt)] ${
          large ? "aspect-[21/9]" : "aspect-[16/10]"
        }`}
      >
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,26,26,0.25)] via-transparent to-transparent" />
        {project.featured && (
          <span className="absolute top-4 left-4 tag bg-[var(--terracotta)] text-[#fff7f1] border-[var(--terracotta)]">
            featured
          </span>
        )}
      </div>

      <div className="p-6 sm:p-7 flex flex-col gap-4 flex-1">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif text-3xl sm:text-4xl tracking-tight">
            {project.title}
          </h3>
          <div className="flex gap-1.5 flex-wrap justify-end">
            {project.tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
        </div>

        <p className="text-[var(--ink-soft)] text-[15px] leading-relaxed">
          {project.tagline}
        </p>
        <p className="text-sm text-[var(--ink-soft)]/80 leading-relaxed">
          {project.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
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
      </div>
    </motion.article>
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

  const featured = projects.find((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section
      id="projects"
      data-testid="projects-section"
      className="relative py-28 md:py-40"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16"
        >
          <div className="md:col-span-7">
            <p className="section-eyebrow mb-4">— 01 / Projects</p>
            <h2 className="font-serif text-5xl md:text-7xl leading-[1] tracking-tight">
              Small things,
              <br />
              <span className="italic text-[var(--ink-soft)]">made with care.</span>
            </h2>
          </div>
          <div className="md:col-span-5 md:pt-10">
            <p className="text-[var(--ink-soft)] leading-relaxed">
              Each project is shipped, hosted and quietly maintained by the same
              two people. Open them in the browser, download them, or rummage
              through the source.
            </p>
          </div>
        </motion.div>

        {loading ? (
          <div
            data-testid="projects-loading"
            className="text-center text-[var(--ink-soft)] py-16 font-mono text-xs"
          >
            Summoning projects…
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            {featured && (
              <div className="md:col-span-12">
                <ProjectCard project={featured} large />
              </div>
            )}
            {rest.map((p) => (
              <div key={p.id} className="md:col-span-6">
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
