import Link from "next/link";
import type { RoadmapStep } from "@/lib/workshops";
import styles from "./Roadmap.module.css";

export function Roadmap({ steps }: { steps: RoadmapStep[] }) {
  return (
    <ol className={styles.steps}>
      {steps.map((step, index) => (
        <li key={step.key} className={styles.step}>
          <span className={styles.num} aria-hidden="true">
            {index + 1}
          </span>
          <div>
            <h3 className={styles.title}>
              {step.link ? (
                <Link href={`/workshops/${step.link}/`}>{step.title}</Link>
              ) : (
                step.title
              )}
            </h3>
            <p className={styles.text}>{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
