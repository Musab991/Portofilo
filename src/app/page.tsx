import { Header } from "@/components/Header";
import { ContactForm } from "@/components/ContactForm";
import { RevealObserver } from "@/components/RevealObserver";
import {
  about,
  projects,
  site,
  skills,
  testimonials,
} from "@/data/portfolio";
import styles from "./page.module.css";

const profileLinks = [
  { href: site.github, label: "GitHub" },
  { href: site.linkedin, label: "LinkedIn" },
  { href: site.upwork, label: "Upwork" },
  ...(site.freelancer
    ? [{ href: site.freelancer, label: "Freelancer" }]
    : []),
].filter((link) => link.href && !link.href.includes("[PLACEHOLDER"));

export default function Home() {
  return (
    <div className={styles.page} id="top">
      <RevealObserver />
      <Header />

      <main>
        <section className={`${styles.hero} ${styles.shell}`} aria-label="Hero">
          <div className={styles.heroCopy}>
            <p className={styles.heroBrand}>{site.brand}</p>
            <h1 className={styles.heroHeadline}>{site.title}</h1>
            <p className={styles.heroSupport}>{site.tagline}</p>
            <div className={styles.heroActions}>
              <a className={styles.btnPrimary} href="#projects">
                View projects
              </a>
              <a className={styles.btnGhost} href="#contact">
                Start a project
              </a>
            </div>
            <div className={styles.heroFacts}>
              <span>{site.availability}</span>
              <span>{site.location}</span>
              <span>{site.rate}</span>
            </div>
          </div>
          <div className={styles.heroPortraitWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={site.photo}
              alt={`${site.name} — ASP.NET Core & SQL backend developer`}
              className={styles.heroPortrait}
              width={220}
              height={220}
              fetchPriority="high"
            />
          </div>
        </section>

        <section id="about" className={`${styles.section} ${styles.shell}`}>
          <div className={styles.aboutGrid}>
            <div data-reveal>
              <p className={styles.sectionLabel}>01 — About</p>
              <h2 className={styles.sectionTitle}>{about.headline}</h2>
            </div>
            <div className={styles.aboutCopy} data-reveal="delay">
              {about.body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <aside className={styles.aboutAside} data-reveal="delay-2">
              <h3>Working details</h3>
              <dl>
                <div>
                  <dt>Location</dt>
                  <dd>{site.location}</dd>
                </div>
                <div>
                  <dt>Availability</dt>
                  <dd>{site.availability}</dd>
                </div>
                <div>
                  <dt>Rate</dt>
                  <dd>{site.rate}</dd>
                </div>
                <div>
                  <dt>Reply time</dt>
                  <dd>Usually within {site.replyWithin}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${site.email}`}>{site.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>Phone / WhatsApp</dt>
                  <dd>
                    <a
                      href={site.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {site.phone}
                    </a>
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        <section id="skills" className={`${styles.section} ${styles.shell}`}>
          <div data-reveal>
            <p className={styles.sectionLabel}>02 — Skills</p>
            <h2 className={styles.sectionTitle}>{skills.headline}</h2>
            <p className={styles.sectionLead}>
              ASP.NET Core on .NET 8/9/10 — EF + ADO.NET, SQL Server, SignalR,
              DDD & design patterns, unit testing, Azure, Docker, and IIS.
            </p>
          </div>
          <div className={styles.skillGroups}>
            {skills.groups.map((group, index) => (
              <div
                key={group.label}
                className={styles.skillGroup}
                data-reveal={
                  index === 0 ? true : index === 1 ? "delay" : "delay-2"
                }
              >
                <h3>{group.label}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className={`${styles.section} ${styles.shell}`}>
          <div data-reveal>
            <p className={styles.sectionLabel}>03 — Projects</p>
            <h2 className={styles.sectionTitle}>Selected case studies</h2>
            <p className={styles.sectionLead}>
              Client work with a clear problem → solution → result structure.
              Scale highlight: ~50,000 vehicles, AVL signal every 30 seconds.
            </p>
          </div>
          <div className={styles.projectList}>
            {projects.map((project, index) => (
              <article
                key={project.id}
                className={styles.project}
                data-reveal={index % 2 === 0 ? true : "delay"}
              >
                <div>
                  <p className={styles.projectIndex}>
                    Case study {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3>{project.title}</h3>
                  <p className={styles.projectMeta}>
                    {project.client} · {project.role}
                  </p>
                  <div className={styles.stack}>
                    {project.stack.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                </div>
                <div className={styles.projectBody}>
                  <div>
                    <h4>Problem</h4>
                    <p>{project.problem}</p>
                  </div>
                  <div>
                    <h4>Solution</h4>
                    <p>{project.solution}</p>
                  </div>
                  <div>
                    <h4>Result</h4>
                    <p>{project.result}</p>
                  </div>
                  {project.images && project.images.length > 0 && (
                    <div className={styles.projectGallery}>
                      {project.images.map((image) => (
                        <figure key={image.src} className={styles.projectShot}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={image.src} alt={image.alt} loading="lazy" />
                          <figcaption>{image.caption}</figcaption>
                        </figure>
                      ))}
                    </div>
                  )}
                  {project.link && (
                    <a className={styles.projectLink} href={project.link}>
                      {project.link}
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="testimonials"
          className={`${styles.section} ${styles.shell}`}
        >
          <div data-reveal>
            <p className={styles.sectionLabel}>04 — Testimonials</p>
            <h2 className={styles.sectionTitle}>What clients say</h2>
            <p className={styles.sectionLead}>
              كلمات بسيطة من ناس اشتغلت معاهم.
            </p>
          </div>
          <div className={styles.testimonialGrid}>
            {testimonials.map((item, index) => (
              <figure
                key={`${item.name}-${index}`}
                className={`${styles.testimonial} ${styles.testimonialRtl}`}
                data-reveal={index === 0 ? true : "delay"}
                lang="ar"
                dir="rtl"
              >
                <blockquote>“{item.quote}”</blockquote>
                <figcaption>
                  <strong>{item.name}</strong>
                  {item.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="contact" className={`${styles.section} ${styles.shell}`}>
          <div className={styles.contactGrid}>
            <div data-reveal>
              <p className={styles.sectionLabel}>05 — Contact</p>
              <h2 className={styles.sectionTitle}>Let&apos;s build something</h2>
              <div className={styles.contactPanel}>
                <p>
                  Tell me about the API, database, or tracking system you need.
                  Email{" "}
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                  {" · "}
                  <a
                    href={site.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp {site.phone}
                  </a>
                  . I usually reply within {site.replyWithin}.
                </p>
                <div className={styles.contactLinks}>
                  {profileLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div data-reveal="delay">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className={`${styles.footer} ${styles.shell}`}>
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          {" · "}
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">
            {site.phone}
          </a>
        </p>
      </footer>
    </div>
  );
}
