import type { Metadata } from "next";
import { PrintButton } from "@/components/PrintButton";
import { cv, profileLinks, projects, site, skills } from "@/data/portfolio";
import { asset } from "@/lib/paths";
import styles from "./cv.module.css";

export const metadata: Metadata = {
  title: "CV",
  description: `${site.name} — ${site.title}. Printable resume.`,
};

export default function CvPage() {
  return (
    <div className={`container ${styles.page}`}>
      <div className={`no-print ${styles.toolbar}`}>
        {cv.pdf ? (
          <a className="btn btn-primary" href={asset(cv.pdf)} download>
            Download CV (PDF)
          </a>
        ) : (
          <PrintButton className="btn btn-primary" label="Download CV (PDF)" />
        )}
        {cv.pdf && <PrintButton className="btn btn-secondary" label="Print" />}
        {!cv.pdf && (
          <p className={styles.hint}>
            Opens the print dialog — choose “Save as PDF”.
          </p>
        )}
      </div>

      <article className={styles.cv}>
        <header className={styles.head}>
          <h1>{site.name}</h1>
          <p className={styles.role}>{site.title}</p>
          <ul className={styles.contact}>
            <li>{site.location}</li>
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              <a href={site.telegram}>t.me/{site.telegramHandle.replace("@", "")}</a>
            </li>
            {profileLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </header>

        <section className={styles.section}>
          <h2>Summary</h2>
          {cv.summary.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </section>

        <section className={styles.section}>
          <h2>Technical skills</h2>
          <dl className={styles.skills}>
            {skills.groups.map((group) => (
              <div key={group.label}>
                <dt>{group.label}</dt>
                <dd>{group.items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        {cv.experience.length > 0 && (
          <section className={styles.section}>
            <h2>Experience</h2>
            {cv.experience.map((job) => (
              <div key={`${job.company}-${job.start}`} className={styles.entry}>
                <h3>
                  {job.title} · {job.company}
                </h3>
                <p className={styles.meta}>
                  {job.start} – {job.end}
                  {job.location ? ` · ${job.location}` : ""}
                </p>
                <ul>
                  {job.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {cv.training.length > 0 && (
          <section className={styles.section}>
            <h2>Training</h2>
            {cv.training.map((item) => (
              <div key={`${item.title}-${item.start}`} className={styles.entry}>
                <h3>{item.title}</h3>
                <p className={styles.meta}>
                  {item.start} – {item.end}
                  {item.location ? ` · ${item.location}` : ""}
                </p>
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        <section className={styles.section}>
          <h2>Selected projects</h2>
          {projects.map((project) => (
            <div key={project.id} className={styles.entry}>
              <h3>{project.title}</h3>
              <p className={styles.meta}>
                {project.client} · {project.role}
              </p>
              <p>{project.result}</p>
              <p className={styles.meta}>{project.stack.join(" · ")}</p>
            </div>
          ))}
        </section>

        {cv.competencies.length > 0 && (
          <section className={styles.section}>
            <h2>Competencies</h2>
            <p>{cv.competencies.join(" · ")}</p>
          </section>
        )}

        {cv.education.length > 0 && (
          <section className={styles.section}>
            <h2>Education</h2>
            {cv.education.map((item) => (
              <div key={item.degree} className={styles.entry}>
                <h3>{item.degree}</h3>
                <p className={styles.meta}>
                  {item.school} · {item.year}
                </p>
              </div>
            ))}
          </section>
        )}

        {cv.languages.length > 0 && (
          <section className={styles.section}>
            <h2>Languages</h2>
            <p>{cv.languages.join(" · ")}</p>
          </section>
        )}
      </article>
    </div>
  );
}
