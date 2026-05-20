import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { ExternalLink, Download, Github, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function ProjectRow({ project, idx }) {
  return (
    <motion.li
      data-testid={`projects-page-card-${project.id}`}
      className="card-paper p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (idx % 6) * 0.06 }}
    >
      <Link
        to={`/projects/${project.id}`}
        className="md:col-span-4 block group"
        data-testid={`projects-page-thumb-${project.id}`}
      >
        <img
          src={project.image}
          alt={project.title}
          className="w-full aspect-[4/3] object-cover rounded-xl border border-[var(--border)] group-hover:scale-[1.02] transition-transform duration-700"
          loading="lazy"
        />
      </Link>
      <div className="md:col-span-8 min-w-0">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <Link to={`/projects/${project.id}`}>
            <h3 className="font-serif text-3xl md:text-5xl tracking-tight hover:text-[var(--terracotta)] transition-colors">
              {project.title}
            </h3>
          </Link>
          <div className="flex gap-1.5 flex-wrap">
            {project.tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
        </div>
        <p className="mt-3 text-[var(--ink-soft)] italic text-lg leading-relaxed">
          {project.tagline}
        </p>
        <p className="mt-1 text-[var(--ink-soft)]/85 leading-relaxed max-w-2xl">
          {project.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.web_url && (
            <a
              href={project.web_url}
              target="_blank"
              rel="noreferrer"
              className="btn-pill"
              data-testid={`pp-open-${project.id}`}
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
              data-testid={`pp-download-${project.id}`}
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
              data-testid={`pp-github-${project.id}`}
            >
              <Github size={14} />
              Source
            </a>
          )}
          <Link
            to={`/projects/${project.id}`}
            className="btn-pill ghost"
            data-testid={`pp-details-${project.id}`}
          >
            Details →
          </Link>
        </div>
      </div>
    </motion.li>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get(`${API}/projects`)
      .then((r) => setProjects(r.data))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main data-testid="projects-page" className="relative">
      <Navbar />
      <section className="pt-36 md:pt-44 pb-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] mb-10"
            data-testid="back-home-link"
          >
            <ArrowLeft size={14} /> Back home
          </Link>

          <p className="section-eyebrow mb-4">— All projects</p>
          <h1 className="headline-serif text-6xl md:text-8xl lg:text-[10rem]">
            The shelf.
          </h1>
          <p className="mt-6 text-[var(--ink-soft)] leading-relaxed max-w-xl text-lg">
            Everything we've quietly built. Each one open, free, and lovingly
            broken on purpose somewhere.
          </p>

          <div className="mt-16">
            {loading ? (
              <div className="font-mono text-xs text-[var(--ink-soft)] py-12">
                Summoning projects…
              </div>
            ) : (
              <ul className="flex flex-col gap-6">
                {projects.map((p, i) => (
                  <ProjectRow key={p.id} project={p} idx={i} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
