import { profileLinks, site } from "@/data/portfolio";
import styles from "./Footer.module.css";

export function Footer({ lang = "en" }: { lang?: "en" | "ar" }) {
  const ar = lang === "ar";
  return (
    <footer className={`no-print ${styles.footer}`}>
      <div className={`container ${styles.inner}`}>
        <p>
          © {new Date().getFullYear()} {ar ? "م. مصعب عطية" : site.name}
        </p>
        <ul className={styles.links}>
          <li>
            <a href={site.telegram} target="_blank" rel="noopener noreferrer">
              {ar ? "تلغرام" : "Telegram"}
            </a>
          </li>
          <li>
            <a href={`mailto:${site.email}`}>{ar ? "إيميل" : "Email"}</a>
          </li>
          {profileLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
