import Link from "next/link";
import {
  type Level,
  formCohorts,
  registrationSubject,
  shortTitle,
} from "@/lib/workshops";
import { formatDate, formatMode, formatPrice } from "./format";
import { type RegisterCohort, RegisterForm } from "./RegisterForm";
import styles from "./RegisterSection.module.css";

/** Register page body for one level: what happens next + the on-site form (or a "closed" note). */
export function RegisterSection({ level }: { level: Level }) {
  const cohorts = formCohorts(level);
  const first = cohorts[0];

  const options: RegisterCohort[] = cohorts.map((c) => ({
    id: c.id,
    label: c.startDate ? `${c.name} — تبدأ ${formatDate(c.startDate)}` : c.name,
    startDate: c.startDate,
    registrationEmail: String(c.registrationEmail),
    subjectPrefix: registrationSubject(level, c),
  }));

  const facts: { term: string; value: string }[] = [];
  if (first) {
    if (first.startDate) facts.push({ term: "البداية", value: formatDate(first.startDate) });
    if (first.schedule) facts.push({ term: "الأيام والوقت", value: first.schedule });
    const mode = formatMode(first.mode, first.location);
    if (mode) facts.push({ term: "الحضور", value: mode });
    facts.push({ term: "السعر", value: formatPrice(first.price, first.currency) });
  }
  const payment = first?.paymentMethods.length ? first.paymentMethods.join(" أو ") : null;
  const price = first && first.price !== null ? formatPrice(first.price, first.currency) : null;

  return (
    <div className={styles.page}>
      <header className="container page-head">
        <p>
          <Link href={`/workshops/${level.slug}/`}>→ تفاصيل {shortTitle(level)}</Link>
        </p>
        <p className="eyebrow">التسجيل · المستوى {level.level}</p>
        <h1 className={styles.title}>سجّل في {shortTitle(level)}</h1>
        {first && <p className="lead">{first.name}. عبّي النموذج وبنرد عليك على الإيميل.</p>}
      </header>

      {!first ? (
        <section className="container section" aria-labelledby="closed-title">
          <div className="card">
            <h2 id="closed-title" className={styles.cardTitle}>
              التسجيل مش مفتوح حالياً
            </h2>
            <p>ما في دفعة مفتوحة للتسجيل بهاد المستوى هلأ. راسلنا على التلغرام وبنبلّغك أول ما يفتح.</p>
            <div className="btn-row">
              <a className="btn btn-primary" href={level.telegramUrl} target="_blank" rel="noopener noreferrer">
                تواصل على تلغرام
              </a>
              <Link className="btn btn-secondary" href="/workshops/">
                كل الورشات
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <div className={`container section ${styles.layout}`}>
          <section className={`card ${styles.formCard}`} aria-labelledby="form-title">
            <h2 id="form-title" className={styles.cardTitle}>
              نموذج التسجيل
            </h2>
            <p className={styles.muted}>كل الحقول مطلوبة ما عدا الملاحظة.</p>
            <RegisterForm levelSlug={level.slug} cohorts={options} telegramUrl={level.telegramUrl} />
          </section>

          <aside className={styles.side} aria-labelledby="next-title">
            <div className="card">
              <h2 id="next-title" className={styles.cardTitle}>
                شو بصير بعد ما تسجّل؟
              </h2>
              <ol className={styles.steps}>
                <li>بتعبّي النموذج، وطلبك بيوصلنا على الإيميل.</li>
                <li>قبل بداية المخيم بنتواصل معك على الإيميل وبنبعتلك رابط Teams.</li>
                <li>بتحضر أول لقاءين تجربة بدون دفع.</li>
                <li>
                  إذا كمّلت: بتدفع{price ? ` ${price}` : ""}
                  {payment ? ` عن طريق ${payment}` : ""} بعد اللقاء الثاني، وبنضيفك لجروب التلغرام
                  الخاص بالدفعة.
                </li>
              </ol>
              {level.refundPolicy && <p className={styles.policy}>{level.refundPolicy}</p>}
            </div>

            {facts.length > 0 && (
              <div className="card">
                <h2 className={styles.cardTitle}>تفاصيل الدفعة</h2>
                <dl className={styles.facts}>
                  {facts.map((fact) => (
                    <div key={fact.term}>
                      <dt>{fact.term}</dt>
                      <dd>{fact.value}</dd>
                    </div>
                  ))}
                </dl>
                {first.notes && <p className={styles.muted}>{first.notes}</p>}
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
