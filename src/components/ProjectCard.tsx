import Link from "next/link";
import type { Project } from "@/data/portfolio";
import styles from "./ProjectCard.module.css";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={`card ${styles.card}`}>
      <h3 className={styles.title}>
        <Link href={`/projects/${project.id}/`}>{project.title}</Link>
      </h3>
      <p className={styles.meta}>{project.client}</p>
      <p>{project.summary}</p>
      <ul className={`chips ${styles.stack}`} aria-label="Stack">
        {project.stack.slice(0, 5).map((tech) => (
          <li key={tech} className="chip">
            {tech}
          </li>
        ))}
      </ul>
    </article>
  );
}
