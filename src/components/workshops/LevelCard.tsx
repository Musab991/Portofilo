import Link from "next/link";
import { type Level, visibleCohorts } from "@/lib/workshops";
import { COHORT_LABEL, LEVEL_LABEL, formatDuration } from "./format";
import styles from "./LevelCard.module.css";

export function LevelCard({ level }: { level: Level }) {
  const cohort = visibleCohorts(level)[0];
  const label = LEVEL_LABEL[level.status] ?? (cohort ? COHORT_LABEL[cohort.status] : null);
  const duration = formatDuration(level, cohort);

  return (
    <article className={`card ${styles.card}`}>
      <p className={styles.level}>المستوى {level.level}</p>
      <h3 className={styles.title}>
        <Link href={`/workshops/${level.slug}/`}>{level.title}</Link>
      </h3>
      {label && <span className={`pill ${label.tone}`}>{label.text}</span>}
      <p>{level.summary}</p>
      {duration && <p className={styles.meta}>{duration}</p>}
      <span className={styles.more} aria-hidden="true">
        التفاصيل ←
      </span>
    </article>
  );
}
