import Link from "next/link";
import type { Cohort, Level } from "@/lib/workshops";
import { CohortCta } from "./CohortCta";
import { COHORT_LABEL, formatDate, formatDuration, formatMode, formatPrice } from "./format";
import styles from "./CohortBanner.module.css";

type Props = {
  level: Level | null;
  cohort: Cohort | null;
  /** Show the level title + link (on /workshops/). */
  showLevel?: boolean;
  headingId?: string;
};

export function CohortBanner({ level, cohort, showLevel = false, headingId }: Props) {
  if (!level || !cohort) {
    return (
      <section className={styles.banner} aria-labelledby={headingId}>
        <h2 id={headingId} className={styles.title}>
          ما في دفعة مجدولة حالياً
        </h2>
        <p className={styles.text}>
          {level ? "لسا ما في موعد أو سعر معلن لهاد المستوى. " : ""}
          تواصل معنا على التلغرام وبنبلّغك أول ما يفتح التسجيل.
        </p>
        <CohortCta cohort={null} telegramUrl={level?.telegramUrl} />
      </section>
    );
  }

  const label = COHORT_LABEL[cohort.status];
  const facts: { term: string; value: string }[] = [];
  if (cohort.startDate) {
    facts.push({
      term: "البداية",
      value: cohort.startDateConfirmed
        ? formatDate(cohort.startDate)
        : `${formatDate(cohort.startDate)} (الموعد قابل للتغيير)`,
    });
  }
  if (cohort.schedule) facts.push({ term: "الأيام والوقت", value: cohort.schedule });
  const duration = formatDuration(level, cohort);
  if (duration) facts.push({ term: "المدة", value: duration });
  const mode = formatMode(cohort.mode, cohort.location);
  if (mode) facts.push({ term: "الحضور", value: mode });
  facts.push({ term: "السعر", value: formatPrice(cohort.price, cohort.currency) });
  if (cohort.earlyBird) {
    facts.push({
      term: "سعر التسجيل المبكر",
      value: `${formatPrice(cohort.earlyBird.price, cohort.currency)} لغاية ${formatDate(cohort.earlyBird.until)}`,
    });
  }
  if (cohort.paymentMethods.length > 0) {
    facts.push({ term: "طريقة الدفع", value: cohort.paymentMethods.join("، ") });
  }
  if (cohort.seats !== null) {
    facts.push({
      term: "المقاعد",
      value:
        cohort.seatsLeft !== null
          ? `${cohort.seatsLeft} من ${cohort.seats} متبقية`
          : `${cohort.seats} مقعد`,
    });
  }
  if (cohort.registrationDeadline) {
    facts.push({ term: "آخر موعد للتسجيل", value: formatDate(cohort.registrationDeadline) });
  }

  return (
    <section className={styles.banner} aria-labelledby={headingId}>
      <div className={styles.head}>
        <span className={`pill ${label.tone}`}>{label.text}</span>
        <h2 id={headingId} className={styles.title}>
          {showLevel ? (
            <Link href={`/workshops/${level.slug}/`}>{level.title}</Link>
          ) : (
            "الدفعة الجاية"
          )}
        </h2>
        <p className={styles.cohortName}>{cohort.name}</p>
      </div>

      <dl className={styles.facts}>
        {facts.map((fact) => (
          <div key={fact.term}>
            <dt>{fact.term}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>

      {level.refundPolicy && <p className={styles.policy}>{level.refundPolicy}</p>}
      {cohort.notes && <p className={styles.text}>{cohort.notes}</p>}
      {cohort.status === "coming-soon" && (
        <p className={styles.text}>
          تواصل معنا على التلغرام وبنبلّغك أول ما يفتح التسجيل.
        </p>
      )}

      <CohortCta cohort={cohort} telegramUrl={level.telegramUrl} />
    </section>
  );
}
