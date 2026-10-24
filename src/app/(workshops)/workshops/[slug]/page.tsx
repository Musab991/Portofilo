import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CohortBanner } from "@/components/workshops/CohortBanner";
import { LEVEL_LABEL, formatDuration } from "@/components/workshops/format";
import { getLevel, getLevels, registrationLink, visibleCohorts } from "@/lib/workshops";
import styles from "./level.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return getLevels().map((level) => ({ slug: level.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const level = getLevel(slug);
  if (!level) return {};
  return {
    title: level.title,
    description: level.summary,
    openGraph: { title: level.title, description: level.summary, locale: "ar_JO" },
  };
}

export default async function LevelPage({ params }: Props) {
  const { slug } = await params;
  const level = getLevel(slug);
  if (!level) notFound();

  const cohort = visibleCohorts(level)[0] ?? null;
  const label = LEVEL_LABEL[level.status];
  const duration = formatDuration(level, cohort ?? undefined);
  const register = registrationLink(level, cohort);

  return (
    <div className={styles.page}>
      <header className="container page-head">
        <p>
          <Link href="/workshops/">→ كل الورشات</Link>
        </p>
        <p className={`eyebrow ${styles.level}`}>المستوى {level.level}</p>
        <h1 className={styles.title}>{level.title}</h1>
        {level.titleEn && (
          <p className={styles.titleEn} lang="en" dir="ltr">
            {level.titleEn}
          </p>
        )}
        {label && <span className={`pill ${label.tone} ${styles.pill}`}>{label.text}</span>}
        <p className="lead">{level.summary}</p>
      </header>

      {level.status === "draft" && (
        <div className="container">
          <p className={styles.notice} role="note">
            مسودة — المحتوى قابل للتغيير، وما في موعد أو سعر معلن لسا.
          </p>
        </div>
      )}

      <div className="container">
        <CohortBanner level={level} cohort={cohort} headingId="cohort-title" />
      </div>

      <section className="container section" aria-labelledby="facts-title">
        <h2 id="facts-title" className="sr-only">
          تفاصيل المستوى
        </h2>
        <div className="grid grid-2">
          <div className="card">
            <h3 className={styles.cardTitle}>المتطلبات</h3>
            <ul className={styles.list}>
              {level.prerequisites.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h3 className={styles.cardTitle}>شو رح تتعلم</h3>
            <ul className="chips">
              {level.stack.map((tech) => (
                <li key={tech} className="chip">
                  {tech}
                </li>
              ))}
            </ul>
            <dl className={styles.facts}>
              {duration && (
                <div>
                  <dt>المدة</dt>
                  <dd>{duration}</dd>
                </div>
              )}
              {level.language && (
                <div>
                  <dt>لغة الشرح</dt>
                  <dd>{level.language}</dd>
                </div>
              )}
              {level.certificate !== null && (
                <div>
                  <dt>الشهادة</dt>
                  <dd>{level.certificate ? "في شهادة" : "ما في شهادة — شهادتك هي مشروعك"}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </section>

      <article className="container">
        <div className="prose" dangerouslySetInnerHTML={{ __html: level.html }} />
      </article>

      {/* Sticky call to action on phones. */}
      <div className={`no-print ${styles.stickyCta}`}>
        {register ? (
          register.external ? (
            <a className="btn btn-primary" href={register.href} target="_blank" rel="noopener noreferrer">
              سجّل الآن
            </a>
          ) : (
            <Link className="btn btn-primary" href={register.href}>
              سجّل الآن
            </Link>
          )
        ) : (
          <span className={styles.stickyNote}>
            {cohort?.status === "full" ? "المقاعد اكتملت" : "التسجيل قريباً"}
          </span>
        )}
        <a
          className={`btn ${register ? "btn-secondary" : "btn-primary"}`}
          href={level.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {register ? "عندك سؤال؟" : "استفسر على تلغرام"}
        </a>
      </div>
    </div>
  );
}
