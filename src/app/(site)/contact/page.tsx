import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { profileLinks, site } from "@/data/portfolio";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Hire Musab Atieh for ASP.NET Core APIs, SQL Server work, and data-heavy backends. Telegram or email.",
};

export default function ContactPage() {
  return (
    <div className="container">
      <header className="page-head">
        <p className="eyebrow">Contact</p>
        <h1>Let&apos;s build something</h1>
        <p className="lead">
          Tell me about the API, database, or tracking system you need. I
          usually reply within {site.replyWithin}.
        </p>
      </header>
      <div className={styles.layout}>
        <aside className="card">
          <h2 className={styles.asideTitle}>Direct</h2>
          <ul className={styles.list}>
            <li>
              <a href={site.telegram} target="_blank" rel="noopener noreferrer">
                Telegram {site.telegramHandle}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            {profileLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>
        <section className="card" aria-label="Contact form">
          <ContactForm />
        </section>
      </div>
    </div>
  );
}
