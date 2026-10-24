import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";
import { about, projects, site, skills } from "@/data/portfolio";
import { asset } from "@/lib/paths";
import styles from "./home.module.css";

export default function Home() {
  return (
    <>
      <section className={`container ${styles.hero}`} aria-labelledby="hero-title">
        <div>
          <p className="eyebrow">{site.name}</p>
          <h1 id="hero-title">{site.title}</h1>
          <p className="lead">{site.tagline}</p>
          <div className="btn-row">
            <Link className="btn btn-primary" href="/projects/">
              View projects
            </Link>
            <Link className="btn btn-secondary" href="/contact/">
              Hire me
            </Link>
          </div>
          <ul className={styles.facts}>
            <li>{site.availability}</li>
            <li>{site.location}</li>
            <li>{site.rate}</li>
          </ul>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are unoptimized */}
        <img
          src={asset(site.photo)}
          alt={`${site.name}, ASP.NET Core & SQL backend developer`}
          className={styles.photo}
          width={220}
          height={220}
          fetchPriority="high"
        />
      </section>

      <section className="section section-tint" aria-labelledby="about-title">
        <div className={`container ${styles.about}`}>
          <div>
            <h2 id="about-title">{about.headline}</h2>
            <div className={styles.aboutBody}>
              {about.body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
          <aside className="card" aria-label="Working details">
            <dl className={styles.details}>
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
                <dt>Contact</dt>
                <dd>
                  <a href={site.telegram} target="_blank" rel="noopener noreferrer">
                    Telegram {site.telegramHandle}
                  </a>
                  <br />
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="section container" aria-labelledby="skills-title">
        <h2 id="skills-title">{skills.headline}</h2>
        <div className="grid grid-3">
          {skills.groups.map((group) => (
            <div key={group.label} className="card">
              <h3 className={styles.groupTitle}>{group.label}</h3>
              <ul className="chips">
                {group.items.map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="section container" aria-labelledby="projects-title">
        <h2 id="projects-title">Selected projects</h2>
        <div className="grid grid-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <p className={styles.more}>
          <Link href="/projects/">All project details →</Link>
        </p>
      </section>

      <section className="container" aria-labelledby="workshops-title">
        <div className={styles.workshops} lang="ar" dir="rtl">
          <p className="eyebrow">ورشات</p>
          <h2 id="workshops-title">ابنِ مشروعك بإيدك</h2>
          <p>
            ورشات عملية أونلاين للخريجين والطلاب: بتبني مشروع Full Stack حقيقي
            بـ C# و ASP.NET Core و SQL Server، وبتطلع بمشروع بتفهمه سطر سطر.
          </p>
          <div className="btn-row">
            <Link className="btn btn-primary" href="/workshops/">
              شوف الورشات
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
