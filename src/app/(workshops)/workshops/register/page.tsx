import type { Metadata } from "next";
import Link from "next/link";
import { RegisterSection } from "@/components/workshops/RegisterSection";
import { site } from "@/data/portfolio";
import { getRegistrableLevels, registerPath } from "@/lib/workshops";

export const metadata: Metadata = {
  title: "التسجيل",
  description: "سجّل بالدفعة الجاية من ورشات م. مصعب عطية. أول لقاءين تجربة بدون دفع.",
  openGraph: { title: "التسجيل — ورشات م. مصعب عطية", locale: "ar_JO" },
};

/**
 * Short link for posts: musabatieh.com/workshops/register/.
 * One open level → its form right here; several → pick a level; none → closed note.
 */
export default function RegisterPage() {
  const levels = getRegistrableLevels();

  if (levels.length === 1) return <RegisterSection level={levels[0]} />;

  return (
    <>
      <header className="container page-head">
        <p>
          <Link href="/workshops/">→ كل الورشات</Link>
        </p>
        <p className="eyebrow">التسجيل</p>
        <h1>{levels.length ? "اختار المستوى اللي بدك تسجّل فيه" : "التسجيل مش مفتوح حالياً"}</h1>
      </header>
      <section className="container section">
        {levels.length ? (
          <ul className="grid grid-2">
            {levels.map((level) => (
              <li key={level.slug} className="card">
                <p className="eyebrow">المستوى {level.level}</p>
                <h2>
                  <Link href={registerPath(level)}>{level.title}</Link>
                </h2>
                <p>{level.summary}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="card">
            <p>ما في دفعة مفتوحة للتسجيل هلأ. راسلنا على التلغرام وبنبلّغك أول ما يفتح التسجيل.</p>
            <div className="btn-row">
              <a className="btn btn-primary" href={site.telegram} target="_blank" rel="noopener noreferrer">
                تواصل على تلغرام
              </a>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
