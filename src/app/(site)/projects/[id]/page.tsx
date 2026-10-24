import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/portfolio";
import { asset } from "@/lib/paths";
import styles from "./project.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ id: project.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  return project
    ? { title: project.title, description: project.summary }
    : {};
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  const sections = [
    { title: "Problem", body: project.problem },
    { title: "Solution", body: project.solution },
    { title: "Result", body: project.result },
  ];

  return (
    <article className="container">
      <header className="page-head">
        <p>
          <Link href="/projects/">← All projects</Link>
        </p>
        <h1 className={styles.title}>{project.title}</h1>
        <p className="lead">
          {project.client} · {project.role}
        </p>
        <ul className="chips" aria-label="Stack">
          {project.stack.map((tech) => (
            <li key={tech} className="chip">
              {tech}
            </li>
          ))}
        </ul>
      </header>

      <div className={styles.body}>
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </div>

      {project.images && project.images.length > 0 && (
        <section className={styles.gallery} aria-label="Screenshots">
          {project.images.map((image) => (
            <figure key={image.src} className="card">
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are unoptimized */}
              <img src={asset(image.src)} alt={image.alt} loading="lazy" />
              <figcaption>{image.caption}</figcaption>
            </figure>
          ))}
        </section>
      )}

      {project.link && (
        <p className={styles.link}>
          <a href={project.link} target="_blank" rel="noopener noreferrer">
            {project.link}
          </a>
        </p>
      )}
    </article>
  );
}
