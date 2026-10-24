import Link from "next/link";
import { type Cohort, type Level, registrationLink } from "@/lib/workshops";
import { site } from "@/data/portfolio";

type Props = { level: Level | null; cohort: Cohort | null; telegramUrl?: string };

/**
 * Register / waitlist / Telegram buttons, decided only from real data:
 * "سجّل الآن" goes to the on-site form (or an external form if one is set),
 * and a button is shown only when its target exists.
 */
export function CohortCta({ level, cohort, telegramUrl = site.telegram }: Props) {
  const register = level ? registrationLink(level, cohort) : null;
  const waitlist =
    cohort && cohort.status !== "open" && cohort.waitlistUrl ? cohort.waitlistUrl : null;

  return (
    <div className="btn-row">
      {register &&
        (register.external ? (
          <a className="btn btn-primary" href={register.href} target="_blank" rel="noopener noreferrer">
            سجّل الآن
          </a>
        ) : (
          <Link className="btn btn-primary" href={register.href}>
            سجّل الآن
          </Link>
        ))}
      {waitlist && (
        <a className="btn btn-primary" href={waitlist} target="_blank" rel="noopener noreferrer">
          {cohort?.status === "full" ? "سجّل اهتمامك للدفعة الجاية" : "بلّغني لما يفتح التسجيل"}
        </a>
      )}
      <a
        className={`btn ${register || waitlist ? "btn-secondary" : "btn-primary"}`}
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {register ? "عندك سؤال؟ راسلنا على تلغرام" : "تواصل على تلغرام"}
      </a>
    </div>
  );
}
