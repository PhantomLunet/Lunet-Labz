import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { ExternalLink, Download, Github, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get(`${API}/projects`)
      .then((r) => {
        setAllProjects(r.data);
        const match = r.data.find((p) => p.id === id);
        setProject(match || null);
      })
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="relative">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center font-mono text-xs text-[var(--ink-soft)]">
          Summoning project…
        </div>
        <Footer />
      </main>
    );
  }

  if (!project) {
    return (
      <main className="relative">
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
          <h1 className="headline-serif text-5xl md:text-7xl">Not found.</h1>
          <p className="mt-4 text-[var(--ink-soft)]">
            This project may have wandered off the shelf.
          </p>
          <button
            onClick={() => navigate("/projects")}
            className="btn-pill mt-8"
            data-testid="back-to-projects"
          >
            Back to all projects
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  const others = allProjects.filter((p) => p.id !== project.id).slice(0, 3);

  return (
    <main data-testid={`project-detail-${project.id}`} className="relative">
      <Navbar />
      <article className="pt-36 md:pt-44 pb-20">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-[var(--ink-soft)] hover:text-[var(--ink)] mb-10"
            data-testid="detail-back-link"
          >
            <ArrowLeft size={14} /> All projects
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
            className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end"
          >
            <div className="md:col-span-7">
              <div className="flex flex-wrap gap-2 mb-5">
                {project.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
              <h1
                className="headline-serif text-6xl md:text-8xl lg:text-[8.5rem] leading-[0.95]"
                data-testid="detail-title"
              >
                {project.title}
              </h1>
              <p className="mt-5 font-serif italic text-2xl md:text-3xl text-[var(--terracotta)]">
                {project.tagline}
              </p>
            </div>
            <div className="md:col-span-5 flex flex-wrap gap-2 md:justify-end">
              {project.web_url && (
                <a
                  href={project.web_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-pill"
                  data-testid={`detail-open-${project.id}`}
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
                  data-testid={`detail-download-${project.id}`}
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
                  data-testid={`detail-github-${project.id}`}
                >
                  <Github size={14} />
                  Source
                </a>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="mt-12 rounded-2xl overflow-hidden border border-[var(--border)] card-paper"
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full aspect-[16/9] object-cover"
            />
          </motion.div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-8">
              <p className="section-eyebrow mb-3">About</p>
              <p className="font-serif text-2xl md:text-3xl leading-relaxed text-[var(--ink)]">
                {project.description}
              </p>
              <div className="divider my-10" />
              <p className="text-[var(--ink-soft)] leading-relaxed">
                Built quietly in the corners of late-night calendars. Free
                forever. If it earns a smile, you can{" "}
                <Link
                  to="/#coffee"
                  className="underline decoration-[var(--terracotta)] underline-offset-4"
                >
                  buy us a coffee
                </Link>
                .
              </p>
            </div>
            <aside className="md:col-span-4">
              <p className="section-eyebrow mb-3">Tags</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
              <p className="section-eyebrow mb-3">Links</p>
              <ul className="space-y-2 text-[var(--ink-soft)]">
                {project.web_url && (
                  <li>
                    <a
                      href={project.web_url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[var(--ink)]"
                    >
                      → Live web app
                    </a>
                  </li>
                )}
                {project.download_url && (
                  <li>
                    <a
                      href={project.download_url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[var(--ink)]"
                    >
                      → Download binary
                    </a>
                  </li>
                )}
                {project.github_url && (
                  <li>
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[var(--ink)]"
                    >
                      → Source on GitHub
                    </a>
                  </li>
                )}
              </ul>
            </aside>
          </div>

          {others.length > 0 && (
            <section className="mt-24">
              <p className="section-eyebrow mb-6">More from the shelf</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {others.map((o) => (
                  <Link
                    key={o.id}
                    to={`/projects/${o.id}`}
                    className="card-paper block overflow-hidden"
                    data-testid={`related-${o.id}`}
                  >
                    <img
                      src={o.image}
                      alt={o.title}
                      className="w-full aspect-[16/10] object-cover"
                    />
                    <div className="p-5">
                      <h4 className="font-serif text-2xl">{o.title}</h4>
                      <p className="text-sm text-[var(--ink-soft)] mt-1">
                        {o.tagline}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
      <Footer />
    </main>
  );
}
