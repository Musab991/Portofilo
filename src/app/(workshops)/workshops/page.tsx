import type { Metadata } from "next";
import { CohortBanner } from "@/components/workshops/CohortBanner";
import { LevelCard } from "@/components/workshops/LevelCard";
import { Roadmap } from "@/components/workshops/Roadmap";
import { site } from "@/data/portfolio";
import { faq, followUp } from "@/data/workshops";
import { getLevels, getNextCohort, getRoadmap } from "@/lib/workshops";
import styles from "./workshops.module.css";

export const metadata: Metadata = {
  title: "الورشات",
  description:
    "مسار عملي من الصفر لمشروع Full Stack حقيقي: Git، C#، ASP.NET Core، SQL Server، HTML/CSS/JS. أونلاين بالعربي مع م. مصعب عطية.",
  openGraph: {
    title: "ورشات م. مصعب عطية — ابنِ مشروعك بإيدك",
    description: "مسار عملي من الصفر لمشروع Full Stack حقيقي، أونلاين بالعربي.",
  },
};

export default function WorkshopsPage() {
  const roadmap = getRoadmap();
  const levels = getLevels();
  const next = getNextCohort();

  return (
    <>
      <section className={`container ${styles.hero}`} aria-labelledby="hero-title">
        <p className="eyebrow">ورشات م. مصعب عطية</p>
        <h1 id="hero-title">ابنِ مشروعك بإيدك</h1>
        <p className="lead">{roadmap.tagline}</p>
        <div className="btn-row">
          <a className="btn btn-primary" href="#next-cohort">
            الدفعة الجاية
          </a>
          <a className="btn btn-secondary" href="#roadmap">
            شوف المسار
          </a>
        </div>
      </section>

      <div className="container" id="next-cohort">
        <CohortBanner
          level={next?.level ?? null}
          cohort={next?.cohort ?? null}
          showLevel
          headingId="next-cohort-title"
        />
      </div>

      <section className="section container" id="roadmap" aria-labelledby="roadmap-title">
        <h2 id="roadmap-title">{roadmap.title}</h2>
        <Roadmap steps={roadmap.steps} />
      </section>

      <section className="section section-tint" aria-labelledby="levels-title">
        <div className="container">
          <h2 id="levels-title">المستويات</h2>
          <div className="grid grid-2">
            {levels.map((level) => (
              <LevelCard key={level.slug} level={level} />
            ))}
          </div>
        </div>
      </section>

      <section className="section container" aria-labelledby="followup-title">
        <h2 id="followup-title">كيف بنتابع معك؟</h2>
        <ol className={`grid grid-3 ${styles.plainList}`}>
          {followUp.map((item) => (
            <li key={item.title} className="card">
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container" aria-label="ليش ابنيه بإيدك">
        <div className="prose" dangerouslySetInnerHTML={{ __html: roadmap.html }} />
      </section>

      <section className="section container" aria-labelledby="faq-title">
        <h2 id="faq-title">أسئلة شائعة</h2>
        <div className={styles.faq}>
          {faq.map((item) => (
            <details key={item.q} className={styles.faqItem}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="container" aria-labelledby="contact-title">
        <div className={styles.contact}>
          <h2 id="contact-title">عندك سؤال؟</h2>
          <p>احكي معنا على التلغرام وبنرد عليك.</p>
          <div className="btn-row">
            <a className="btn btn-primary" href={site.telegram} target="_blank" rel="noopener noreferrer">
              تواصل على تلغرام
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
