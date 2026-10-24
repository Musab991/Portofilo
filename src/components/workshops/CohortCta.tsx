import type { Cohort } from "@/lib/workshops";
import { site } from "@/data/portfolio";

type Props = { cohort: Cohort | null; telegramUrl?: string };

/**
 * Register / waitlist / Telegram buttons, decided only from real data:
 * a button is shown only when its link exists.
 */
export function CohortCta({ cohort, telegramUrl = site.telegram }: Props) {
  const register =
    cohort?.status === "open" && cohort.registrationUrl ? cohort.registrationUrl : null;
  const waitlist =
    cohort && cohort.status !== "open" && cohort.waitlistUrl ? cohort.waitlistUrl : null;

  return (
    <div className="btn-row">
      {register && (
        <a className="btn btn-primary" href={register} target="_blank" rel="noopener noreferrer">
          سجّل هلأ
        </a>
      )}
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
        {register ? "استفسر على تلغرام" : "تواصل على تلغرام"}
      </a>
    </div>
  );
}
